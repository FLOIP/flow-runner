# Flow Interoperability Project (FLOIP) Flow Runner

## What are Flows?

Flows are a modern paradign for describing the logic of digital information systems that interact with individuals,
often for the purpose of (a) collecting data or (b) providing information through interactive requests.
Some common examples of this are in mobile services using voice-based or SMS-based conversations over basic mobile
phones. Flows follow the "flowchart" paradigm, consisting of actions (nodes) and connections between actions, which can
incorporate decision-making logic.

More details and definitions of components within this ecosystem at: https://floip.gitbook.io/flow-specification/

## What is a runner?

Flow Runner is a concrete implementation of the Flow Interoperability specification, providing a tool that can traverse Flows and their Blocks to generate interaction history with a Contact.

## Usage example 1: Basic

To begin and set up, we first need to create a context to run a flow with. We have exposed a helper method with sane defaults to support this called `createContextDataObjectFor(contact)`.

Context is the single piece of truth to the state of the current run, which must adhere to the IContext interface (source found at: src/flow-spec/IContext.ts). We've designed this tool in such a way that we can pause execution between any interactive interaction and resume exactly where we'd left off. The context object is all we need, and it's 100% JSON-serializable.

Contact is any concrete implementation of the exposed interface `IContact`, which only requires three props as follows:

```typescript
// via src/flow-spec/IContact.ts
interface IContact {
  id: string
  name: string
  createdAt: string
}
```

Next, we create a runner instance by providing the newly generated context data object as the first parameter.

And lastly, invoke `run()`.

```typescript
const context: IContext = createContextDataObjectFor(
  contact,
  userId,
  orgId,
  flows,
  languageId)

const runner: IFlowRunner = new FlowRunner(context)
runner.run()
```

### Great! What does this get us?

We can inspect how the run went through a few different artifacts:

1. Wether or not `null` is returned by the `run()` method — We'll dive deeper into possible return values a bit later on.
2. Whether or not errors are thrown ;)
3. Delivery status — found at `context.deliveryStatus`, and will be populated from the enumerated type `DeliveryStatus` (src/flow-spec/DeliveryStatus.ts). A typical run will cycle through these values like this: `QUEUED` → `IN_PROGRESS` → `FINISHED_COMPLETE`.
4. Exit timestamp — found at `context.exitAt`, and will be populated once execution has entered the FINISHED_COMPLETE state, and will be in the format: `2020-01-01 08:30:00.000Z`


## Usage example 2: Interactive blocks with Prompts

Some Flows contain Blocks that require interaction with the Contact (via the host application) during their execution in order to fulfill their role within the Flow. This is accomplished through an interface exposed as IPrompt (src/domain/prompt/IPrompt.ts).

When running a flow, the runner will sprint full speed ahead until reaching a block requiring interaction, at which point the runner will pause, return a cursor (containing an IPrompt), and wait until further action is taken.

Cursor comes in a few varieties, but for now we'll only concern ourselves with `IRichCursorInputRequired`. This variant indicates a point in our run history that contains an IPrompt associated with it— hence, `InputRequired`.

---

Let's take a simple example of a flow containing a block requiring string input of any length. Note that there are two functionally identical paradigms for resuming a flow run:

```typescript
const runner: IFlowRunner = new FlowRunner(context)
const {prompt}: IRichCursorInputRequired = runner.run()!

// continuation via runner
prompt.value = 'Jenso Ubla'
const {prompt}: IRichCursorInputRequired = runner.run()!

// continuation via prompt
const {prompt}: IRichCursorInputRequired = prompt.fulfill('Jenso Ubla')!
```

---

The prompt's requirements are preconfigured in the corresponding block before the run is begun. An example of configuration that could take place are min/max constraints when requiring numeric input.

Note that at the lowest level, the `validate(input)` method is called when attempting to set a value on the prompt instance. What this means is that we'll see `PromptValidationException` s bubbled at all levels:

```typescript
> prompt.fulfill(200)

Error: Value provided is greater than allowed

    at NumericPrompt.validate (src/domain/prompt/NumericPrompt.ts:20:13)
    at NumericPrompt.set value [as value] (src/domain/prompt/BasePrompt.ts:46:27)
    at NumericPrompt.fulfill (src/domain/prompt/BasePrompt.ts:63:15)
```

```typescript
> prompt.value = 200

Error: Value provided is greater than allowed

    at NumericPrompt.validate (src/domain/prompt/NumericPrompt.ts:20:13)
    at NumericPrompt.set value [as value] (src/domain/prompt/BasePrompt.ts:46:27)
    at NumericPrompt.fulfill (src/domain/prompt/BasePrompt.ts:63:15)
```

```typescript
> prompt.validate(200)

Error: Value provided is greater than allowed

    at NumericPrompt.validate (src/domain/prompt/NumericPrompt.ts:20:13)
    at NumericPrompt.set value [as value] (src/domain/prompt/BasePrompt.ts:46:27)
    at NumericPrompt.fulfill (src/domain/prompt/BasePrompt.ts:63:15)
```

### How to use a prompt?

We are free to do what we need to with the prompt instance in order to fetch valid data from the `Contact` before proceeding with the Flow run. Typically, an application will render a UI while hanging onto the `IPrompt` instance, leveraging the validation provided to provide feedback as the Contact interacts with the UI; once successful, simply invoke `runner.run()` or `prompt.fulfill()`. Since `undefined` is never a valid value on a prompt, invoking `fulfill()` parameterless will attempt to resume the Flow with the current prompt value.

```typescript
prompt.value = 'Jenso Ubla'
const {prompt}: IRichCursorInputRequired = prompt.fulfill()!
```

### Prompt types

Currently, we have exposed 6 prompt types for interacting with a Contact (https://floip.gitbooks.io/flow-specification/content/layers.html):

1. `src/domain/prompt/MessagePrompt` — Present a message to a Contact, action required to resume Flow run.
2. `src/domain/prompt/NumericPrompt` — Request a number, optionally within particular bounds.
3. `src/domain/prompt/OpenPrompt` — Request a string of text, optionally with a maximum length boundary.
4. `src/domain/prompt/SelectManyPrompt` — Request a selection from multiple choices, optionally requiring at least one.
5. `src/domain/prompt/SelectOnePrompt` — Request, at most, one selection from multiple choices.
6. `src/domain/prompt/ReadPrompt` — Request input using platform dependent readline utility.


## Usage example 3: Cursors explained

`ICursor` is an interface of two properties, enough information to know where we're at in the Flow's run and retrieve input from an `IContact` if we've yet to. While maintaining JSON-serializability.

```typescript
interface ICursor {
  /**
   * UUID of the current interaction with a block.
   */
  interactionId: string
  /**
   * A prompt configuration data object; optional, because not every block requests input from the Contact.
   * If it does, we call it an `ICursorInputRequired`.
   * If not, `ICursorNoInputRequired` will have a `null-ish` `promptConfig`.
   */
  promptConfig?: IPromptConfig
}
```

Sometimes we need a bit more data to pass around and some functional behaviour to work with. This is where  the concept of hydration/dehydration comes in. With an `ICursor`'s corresponding `IContext`, we can swap between our primitive and rich cursor formats.

```
const richCursor: IRichCursor = runner.hydrateRichCursorFrom(context)
```

```
const cursor: ICursor = runner.dehydrateCursor(richCursor)
```

`IRichCursor` is also an interface of two properties, but this time they're objects.

```typescript
interface IRichCursor {
  /**
   * An object representation of the current interaction with a block.
   */
  interaction: IBlockInteraction
  /**
   * In IPrompt instance.
   * When present, we call it a TRichCursorInputRequired.
   * In absence, the TRichCursorNoInputRequired will maintain `prompt` with a null-ish value.
   */
  prompt?: IPrompt
}

```

The first of the two properties is an object representation of the current interaction with a block:

```
interface IBlockInteraction {
  uuid: string
  blockId: string
  flowId: string
  entryAt: string
  exitAt?: string
  hasResponse: boolean
  value?: string | number | object
  details: IBlockInteractionDetails
  selectedExitId: string | null
  type: string

  originBlockInteractionId?: string
  originFlowId?: string
}
```

The current cursor lives on our `IContext` on a property named `cursor`, and is always in dehydrated format.

### Managing cursors

We can use our cursor to identify some details about the current run. Some examples:

```
const cursor: IRichCursorInputRequired | undefined = runner.run()

if (cursor == null) {
  // run completed
}
```

```
const context: IContext = createContextDataObjectFor(
  contact,
  userId,
  flows,
  languageId)

if (context.cursor == null) {
  // not yet running
}
```

```
if (context.cursor.promptConfig == null) {
  // can resume execution, input not required
}
```

```
if (context.cursor.promptConfig != null && runner.isInputRequiredFor(ctx)) {
  // prompt present, we should hydrate it
  const {prompt}: IRichCursor = runner.hydrateRichCursorFrom(ctx)
  // ... render UI to satisfy prompt
}
```

### Interaction history

It should be noted here, that after satisfying a prompt, and taking action on runner (or prompt) instance to resume running, the value from the prompt is directly copied to the prompt's corresponding entity in the run history. These entities are `IBlockInteraction` instances and are stored in a list at `IContext.interactions`.

## Usage example 4: Customization of block runners

Sometimes we need to perform some additional customization of our `IBlockRunner` collection before beginning the Flow run.

> Please be very wary of modifying this configuration amidst a partially completed flow run, this has the potential for reducing the predictability and consistency of resulting run data.

`IBlockRunner` is an interface by which we provide an extensible framework for getting an abstract IBlock into our interaction history through the provision of instructions to FlowRunner.

By default, our block runner factory collection is generated each time a FlowRunner is instantiated via the exposed `createDefaultBlockRunnerStore()`. However, this can also be overridden with a modified version of the default collection or an entirely different collection:

```typescript
const runnerFactoryStore: IBlockRunnerFactoryStore = createDefaultBlockRunnerStore()
const runner: IFlowRunner = new FlowRunner(context, runnerFactoryStore)
```

We may want to modify the block runner store if we have some additional block types we'd like to support, or in the rare case that we'd like to override an existing block type implementation with something different, this is also facilitated through this very same interface.

```typescript
const runnerFactoryStore: IBlockRunnerFactoryStore = createDefaultBlockRunnerStore()

// existing block runners can retrieved
const messageBlockRunnerFactory: TBlockRunnerFactory = runnerFactoryStore.get('MobilePrimitives\\Message')

// ... and new block runners can be added
runnerFactoryStore.set('MobilePrimitives\\Message', (block, ctx) =>
  new MessageBlockRunner(block as IMessageBlock, ctx))

const runner: IFlowRunner = new FlowRunner(context, runnerFactoryStore)
```

When attempting to run a flow containing a block type that's not yet had a block runner configured, we receive an exception as follows:

```typescript
Error: Unable to find factory for block type: MobilePrimitives\SelectOneResponse

    at FlowRunner.createBlockRunnerFor (src/domain/FlowRunner.ts:356:13)
    at FlowRunner.buildPromptFor (src/domain/FlowRunner.ts:509:25)
    at FlowRunner.initializeOneBlock (src/domain/FlowRunner.ts:327:31)
    at FlowRunner.navigateTo (src/domain/FlowRunner.ts:370:29)
    at FlowRunner.initialize (src/domain/FlowRunner.ts:129:17)
    at FlowRunner.run (src/domain/FlowRunner.ts:179:12)
```

A block's type is denoted by the `IBlock.type` property, which is an arbitrary string expected to be unique within the ecosystem. We've namespaced provided implementations by prefixing with [predefined strings](https://floip.gitbooks.io/flow-specification/content/layers.html) (eg. `MobilePrimitives\*`)

### Custom block implementation

There are three pieces that work together when implementing a new block type:

1. `IBlock.type` property (https://floip.gitbooks.io/flow-specification/content/fundamentals/flows.html#blocks)
2. `IBlockRunner` implementation
3. `TBlockRunnerFactory` implementation when initiating a flow

The only new piece in that list is our `IBlockRunner` interface:

```typescript
interface IBlockRunner {
  block: IBlock
  context: IContext

  initialize(interaction: IBlockInteraction): IPromptConfig | undefined

  run(cursor: IRichCursor): IBlockExit
}
```

As seen above, there are two methods to implement this contract:

1. `initialize` — converts an interaction and its block property into either a prompt configuration or `undefined`.
	- `IPromptConfig` is the guts of a prompt and has all of the pieces needed to interact with an `IContact`. If a block type has no need to halt flow execution to interact with the `IContact`, then simply returning without any configuration is all we need.
	- 	Some applications will provide the ability to step back through interaction history to a previous point in time. In this case, we utilize the interaction reference in order to initialize a prompt with the previous value already pre-populated onto it. This is best practice, and we'll see an example of it below.

2. `run` — takes the current point in our interaction history and performs some local logic to decide how the Flow should continue by returning the desired IBlockExit to be used. In some cases we always resolve to a single exit, but many cases have more complexity around this part of the puzzle.

For example, a trimmed down version of our `NumericResponseBlockRunner` is as follows:

```typescript
class NumericResponseBlockRunner implements IBlockRunner {
  constructor(
    public block: INumericResponseBlock,
    public context: IContext) {}

  initialize({value}: IBlockInteraction): INumericPromptConfig {
    return {
      kind: NUMERIC_PROMPT_KEY,
      prompt: this.block.config.prompt,
      isResponseRequired: false,

      min: this.block.config.validationMinimum,
      max: this.block.config.validationMaximum,

      value: value as INumericPromptConfig['value'],
    }
  }

  run(cursor: RichCursorType): IBlockExit {
    return this.block.exits[0]
  }
}
```


## Usage example 5: Customization of FlowRunner via `IBehaviour`

`IBehaviour`s are our first pass at solving for extensibility within the FlowRunner itself.

```typescript
interface IBehaviour {
  context: IContext
  navigator: IFlowNavigator
  promptBuilder: IPromptBuilder

  postInteractionCreate(interaction: IBlockInteraction, context: IContext): IBlockInteraction
  postInteractionComplete(interaction: IBlockInteraction, context: IContext): void
}
```

As seen above, we currently have two hooks available:

1. `postInteractionCreate`
	- invoked immediately after any block interaction has begun
	- invoked immediately before (a) the `IBlockRunner` has been initialized (b) the interaction has been pushed onto the interaction history stack.
	- also provides an opportunity to generate a different interaction entity; please be wary of this component of `postInteractionCreate()`, this is a very low-level feature and rarely needed, precautions must be taken.
2. `postInteractionComplete`
	- invoked immediately after (a) the `IBlockRunner` has been run (b) the `IBlockExit` has been selected (c) the associated `IPrompt` is marked as `isSubmitted`
	- invoked immediately before the next block is to be discovered.

`IBehaviour`s, like `IBlockRunner`s are initialized at the same time as FlowRunner is initialized. The process, however is slightly different. `IBehaviour`s live within a public `behaviours` property on the runner as a dictionary where the key is the name we'll use to find the instance later, and the value is an instance of our concrete `IBehaviour` implementation.

```
const runner: IFlowRunner = new FlowRunner(context)
runner.behaviours.basicBacktracking = new BasicBacktrackingBehaviour(context)
```

A couple examples of how we've found behaviours useful are:

- traversing back through interaction history
- improving performance through caching values
