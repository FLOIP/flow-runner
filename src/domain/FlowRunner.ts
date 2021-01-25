/* eslint-disable @typescript-eslint/no-namespace,import/export */
/**
 * Flow Interoperability Project (flowinterop.org)
 * Flow Runner
 * Copyright (c) 2019, 2020 Viamo Inc.
 * Authored by: Brett Zabos (brett.zabos@viamo.io)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/

import {NonBreakingUpdateOperation, update} from 'sp2'
import {find, first, includes, last, lowerFirst, trimEnd} from 'lodash'
import {
  assertNotNull,
  BasicBacktrackingBehaviour,
  CaseBlockRunner,
  ContextService,
  createFormattedDate,
  DeliveryStatus,
  findBlockExitWith,
  IBehaviour,
  IBehaviourConstructor,
  IBlock,
  IBlockExit,
  IBlockInteraction,
  IBlockRunner,
  IBlockRunnerFactoryStore,
  ICaseBlock,
  IContext,
  IContextInputRequired,
  IContextService,
  IContextWithCursor,
  ICursor,
  IdGeneratorUuidV4,
  IFlowRunner,
  IIdGenerator,
  ILogBlock,
  IMessageBlock,
  INumericResponseBlock,
  IOpenResponseBlock,
  IOutputBlock,
  IPrintBlock,
  IPromptConfig,
  IReversibleUpdateOperation,
  IRichCursor,
  IRichCursorInputRequired,
  IRunFlowBlock,
  ISelectOneResponseBlock,
  ISetGroupMembershipBlock,
  LogBlockRunner,
  MessageBlockRunner,
  NumericResponseBlockRunner,
  OpenResponseBlockRunner,
  OutputBlockRunner,
  PrintBlockRunner,
  Prompt,
  PromptConstructor,
  ResourceResolver,
  RunFlowBlockRunner,
  SelectManyResponseBlockRunner,
  SelectOneResponseBlockRunner,
  SET_GROUP_MEMBERSHIP_BLOCK_TYPE,
  SetGroupMembershipBlockRunner,
  TBlockRunnerFactory,
  TGenericPrompt,
  ValidationException,
} from '..'

export class BlockRunnerFactoryStore extends Map<string, TBlockRunnerFactory> implements IBlockRunnerFactoryStore {}

export interface IFlowNavigator {
  navigateTo(block: IBlock, ctx: IContext): Promise<IRichCursor>
}

export interface IPromptBuilder {
  buildPromptFor(block: IBlock, interaction: IBlockInteraction): Promise<TGenericPrompt | undefined>
}

const DEFAULT_BEHAVIOUR_TYPES: IBehaviourConstructor[] = [
  BasicBacktrackingBehaviour,
  // BacktrackingBehaviour,
]

/**
 * Block types that do not request additional input from an `IContact`
 */
export const NON_INTERACTIVE_BLOCK_TYPES = ['Core\\Case', 'Core\\RunFlow']

/**
 * A map of `IBlock.type` to an `TBlockRunnerFactory` function.
 */
export function createDefaultBlockRunnerStore(): IBlockRunnerFactoryStore {
  return new BlockRunnerFactoryStore([
    ['MobilePrimitives\\Message', (block, ctx) => new MessageBlockRunner(block as IMessageBlock, ctx)],
    ['MobilePrimitives\\OpenResponse', (block, ctx) => new OpenResponseBlockRunner(block as IOpenResponseBlock, ctx)],
    ['MobilePrimitives\\NumericResponse', (block, ctx) => new NumericResponseBlockRunner(block as INumericResponseBlock, ctx)],
    ['MobilePrimitives\\SelectOneResponse', (block, ctx) => new SelectOneResponseBlockRunner(block as ISelectOneResponseBlock, ctx)],
    ['MobilePrimitives\\SelectManyResponse', (block, ctx) => new SelectManyResponseBlockRunner(block as ISelectOneResponseBlock, ctx)],
    ['Core\\Case', (block, ctx) => new CaseBlockRunner(block as ICaseBlock, ctx)],
    ['Core\\Output', (block, ctx) => new OutputBlockRunner(block as IOutputBlock, ctx)],
    ['Core\\Log', (block, ctx) => new LogBlockRunner(block as ILogBlock, ctx)],
    ['ConsoleIO\\Print', (block, ctx) => new PrintBlockRunner(block as IPrintBlock, ctx)],
    ['Core\\RunFlow', (block, ctx) => new RunFlowBlockRunner(block as IRunFlowBlock, ctx)],
    [SET_GROUP_MEMBERSHIP_BLOCK_TYPE, (block, ctx) => new SetGroupMembershipBlockRunner(block as ISetGroupMembershipBlock, ctx)],
  ])
}

/**
 * Main interface into this library.
 * @see README.md for usage details.
 */
// eslint-disable-next-line import/export
export class FlowRunner implements IFlowRunner, IFlowNavigator, IPromptBuilder {
  /** Running context, JSON-serializable entity with enough information to start or resume a Flow. */
  public context: IContext

  /** Map of block types to a factory producting an IBlockRunner instnace. */
  public runnerFactoryStore: IBlockRunnerFactoryStore = createDefaultBlockRunnerStore()

  /** Instance used to `generate()` unique IDs across interaction history. */
  protected idGenerator: IIdGenerator = new IdGeneratorUuidV4()

  /** Instances providing isolated functionality beyond the default runner, leveraging built-in hooks. */
  public behaviours: {[key: string]: IBehaviour} = {}

  public _contextService: IContextService = ContextService

  constructor(
    context: IContext,
    runnerFactoryStore: IBlockRunnerFactoryStore = createDefaultBlockRunnerStore(),
    idGenerator: IIdGenerator = new IdGeneratorUuidV4(),
    behaviours: {[key: string]: IBehaviour} = {},
    _contextService: IContextService = ContextService
  ) {
    this._contextService = _contextService
    this.behaviours = behaviours
    this.idGenerator = idGenerator
    this.runnerFactoryStore = runnerFactoryStore
    this.context = context
    this.initializeBehaviours(DEFAULT_BEHAVIOUR_TYPES)
  }

  /**
   * Take list of constructors and initialize them like: ```
   * runner.initializeBehaviours([MyFirstBehaviour, MySecondBehaviour])
   * runner.behaviours.myFirst instanceof MyFirstBehaviour
   * runner.behaviours.mySecond instanceof MySecondBehaviour
   * ``` */
  initializeBehaviours(behaviourConstructors: IBehaviourConstructor[]): void {
    behaviourConstructors.forEach(
      behaviourConstructor =>
        (this.behaviours[lowerFirst(trimEnd(behaviourConstructor.name, 'Behaviour|Behavior'))] = new behaviourConstructor(
          this.context,
          this,
          this
        ))
    )
  }

  /**
   * Initialize entry point into this flow run; typically called internally.
   * Sets up first block, engages run state and entry timestamp on context.
   */
  async initialize(): Promise<IRichCursor | undefined> {
    const ctx = this.context
    const block = this.findNextBlockOnActiveFlowFor(ctx)

    if (block == null) {
      throw new ValidationException('Unable to initialize flow without blocks.')
    }

    ctx.deliveryStatus = DeliveryStatus.IN_PROGRESS
    ctx.entryAt = createFormattedDate()

    // kick-start by navigating to first block
    return this.navigateTo(block, this.context)
  }

  /**
   * Verify whether or not we have a pointer in interaction history or not.
   * This identifies whether or not a run is in progress.
   * @param ctx
   */
  isInitialized(ctx: IContext): ctx is IContextWithCursor {
    // const {cursor, entryAt, exitAt} = ctx
    // return cursor && entryAt && !exitAt

    return ctx.cursor != null
  }

  /**
   * Decipher whether or not cursor points to the first interactive block or not.
   */
  isFirst(): boolean {
    if (!this.isInitialized(this.context)) {
      return true
    }

    const {interactions} = this.context
    const firstInteractiveIntx = find(interactions, ({type}) => !includes(NON_INTERACTIVE_BLOCK_TYPES, type))

    if (firstInteractiveIntx == null) {
      return true
    }

    return firstInteractiveIntx.uuid === this.context.cursor.interactionId
  }

  /**
   * Decipher whether or not cursor points to the last block from interaction history.
   */
  isLast(): boolean {
    if (!this.isInitialized(this.context)) {
      return true
    }

    const {interactions} = this.context
    return last(interactions)?.uuid === this.context.cursor.interactionId
  }

  /**
   * Either begin or a resume a flow run, leveraging context instance member.
   */
  async run(): Promise<IRichCursorInputRequired | undefined> {
    const {context: ctx} = this
    if (!this.isInitialized(ctx)) {
      await this.initialize()
    }

    return this.runUntilInputRequiredFrom(ctx as IContextWithCursor)
  }

  /**
   * Decipher whether or not calling run() will be able to proceed or our cursor's prompt is in an invalid state.
   * @param ctx
   */
  isInputRequiredFor(ctx: IContext): boolean {
    if (ctx.cursor == null || ctx.cursor.promptConfig == null) {
      return false
    }

    if (ctx.cursor.promptConfig.value === undefined) {
      return true
    }

    const {prompt}: IRichCursorInputRequired = this.hydrateRichCursorFrom(ctx as IContextInputRequired) as IRichCursorInputRequired

    return !prompt.isValid()
  }

  // todo: this could be findFirstExitOnActiveFlowBlockFor to an Expressions Behaviour
  //       ie. cacheInteractionByBlockName, applyReversibleDataOperation and reverseLastDataOperation
  cacheInteractionByBlockName(
    {uuid, entryAt}: IBlockInteraction,
    {name, config: {prompt}}: IMessageBlock,
    context: IContext = this.context
  ): void {
    if (!('blockInteractionsByBlockName' in this.context.sessionVars)) {
      context.sessionVars.blockInteractionsByBlockName = {}
    }

    if (context.reversibleOperations == null) {
      context.reversibleOperations = []
    }

    // create a cache of `{[block.name]: {...}}` for subsequent lookups
    const blockNameKey = `blockInteractionsByBlockName.${name}`
    const previous = this.context.sessionVars[blockNameKey]
    const resource = prompt == null ? undefined : new ResourceResolver(context).resolve(prompt)

    const current = {
      __interactionId: uuid,
      time: entryAt,
      text: resource != null && resource.hasText() ? resource.getText() : '',
    }

    this.applyReversibleDataOperation({$set: {[blockNameKey]: current}}, {$set: {[blockNameKey]: previous}})
  }

  /**
   * Apply a mutation to `sessionVars` and operations in both directions.
   * These vars are made available in content Expressions.
   * @param forward
   * @param reverse
   * @param context
   */
  applyReversibleDataOperation(
    forward: NonBreakingUpdateOperation,
    reverse: NonBreakingUpdateOperation,
    context: IContext = this.context
  ): void {
    context.sessionVars = update(context.sessionVars, forward)
    context.reversibleOperations.push({
      interactionId: last(context.interactions)?.uuid,
      forward,
      reverse,
    })
  }

  /**
   * Pop last mutation to `sessionVars` and apply its reversal operation.
   * @param context
   */
  reverseLastDataOperation(context: IContext = this.context): IReversibleUpdateOperation | undefined {
    if (context.reversibleOperations.length === 0) {
      return
    }

    const lastOperation = last(context.reversibleOperations) as IReversibleUpdateOperation
    context.sessionVars = update(context.sessionVars, lastOperation.reverse)
    return context.reversibleOperations.pop()
  }

  /**
   * Pushes onward through the flow when cursor's prompt has been fulfilled and there are blocks to draw from.
   * This will continue running blocks until an interactive block is encountered and input is required from
   * the IContact.
   * Typically called internally.
   * @param ctx
   */
  async runUntilInputRequiredFrom(ctx: IContextWithCursor): Promise<IRichCursorInputRequired | undefined> {
    let richCursor: IRichCursor = this.hydrateRichCursorFrom(ctx)
    let block: IBlock | undefined = this._contextService.findBlockOnActiveFlowWith(richCursor.interaction.blockId, ctx)

    do {
      if (this.isInputRequiredFor(ctx)) {
        console.info('Attempted to resume when prompt is not yet fulfilled; resurfacing same prompt instance.')
        return richCursor as IRichCursorInputRequired
      }

      await this.runActiveBlockOn(richCursor, block)

      block = this.findNextBlockOnActiveFlowFor(ctx)

      while (block == null && this._contextService.isNested(ctx)) {
        // nested flow complete, while more of parent flow remains
        block = this.stepOut(ctx)
      }

      if (block == null) {
        // bail-- we're done.
        continue
      }

      if (block.type === 'Core\\RunFlow') {
        richCursor = await this.navigateTo(block, ctx)
        block = this.stepInto(block, ctx)
      }

      if (block == null) {
        // bail-- we done.
        continue
      }

      richCursor = await this.navigateTo(block, ctx)
    } while (block != null)

    this.complete(ctx)
    return
  }

  // exitEarlyThrough(block: IBlock) {
  // todo: generate link from current interaction to exit block (flow.exitBlockId)
  // todo: raise if flow.exitBlockId not defined
  // todo: set delivery status on context as INCOMPLETE
  // }

  /**
   * Close off last interaction, push context status to complete, and write out exit timestamp.
   * Typically called internally.
   * @param ctx
   * @param completedAt
   */
  complete(ctx: IContext, completedAt: Date = new Date()): void {
    delete ctx.cursor
    ctx.deliveryStatus = DeliveryStatus.FINISHED_COMPLETE
    ctx.exitAt = createFormattedDate(completedAt)
  }

  /**
   * Seal up an [[IBlockInteraction]] with a timestamp once we've selected an exit.
   * @param intx
   * @param selectedExitId
   * @param completedAt
   */
  completeInteraction(intx: IBlockInteraction, selectedExitId: IBlockExit['uuid'], completedAt: Date = new Date()): IBlockInteraction {
    intx.exitAt = createFormattedDate(completedAt)
    intx.selectedExitId = selectedExitId

    return intx
  }

  /**
   * Seal up an interaction with an [[IRunFlowBlock]] which spans multiple child [[IBlockInteraction]]s.
   * This will apply a timestamp to parent [[IRunFlowBlock]]'s [[IBlockInteraction]], unnest active flow one level
   * and return the interaction for that parent [[IRunFlowBlock]].
   * @param ctx
   * @param completedAt
   */
  completeActiveNestedFlow(ctx: IContext, completedAt: Date = new Date()): IBlockInteraction {
    const {nestedFlowBlockInteractionIdStack} = ctx

    if (!this._contextService.isNested(ctx)) {
      throw new ValidationException('Unable to complete a nested flow when not nested.')
    }

    const runFlowIntx = this._contextService.findInteractionWith(last(nestedFlowBlockInteractionIdStack) as string, ctx)

    // once we are in a valid state and able to find our corresponding interaction, let's update active nested flow
    nestedFlowBlockInteractionIdStack.pop()

    // since we've un-nested one level, we may seek using freshly active flow
    const exit: IBlockExit = this.findFirstExitOnActiveFlowBlockFor(runFlowIntx, ctx)
    return this.completeInteraction(runFlowIntx, exit.uuid, completedAt)
  }

  /**
   * Take a richCursor down to the bare minimum for JSON-serializability.
   * interaction IBlockInteraction reduced to its UUID
   * prompt IPrompt reduced to its raw config object.
   * Reverse of `hydrateRichCursorFrom()`.
   * @param richCursor
   */
  dehydrateCursor(richCursor: IRichCursor): ICursor {
    return {
      interactionId: richCursor.interaction.uuid,
      promptConfig: richCursor.prompt != null ? richCursor.prompt.config : undefined,
    }
  }

  /**
   * Take raw cursor off an `IContext` and generate a richer, more detailed version; typically not JSON-serializable.
   * interactionId string UUID becomes full IBlockInteraction data object
   * promptConfig IPromptConfig becomes full-fledged Prompt instance corresponding to `kind`.
   * Reverse of `dehydrateCursor()`.
   * @param ctx
   */
  hydrateRichCursorFrom(ctx: IContextWithCursor): IRichCursor {
    const {cursor} = ctx
    const interaction = this._contextService.findInteractionWith(cursor.interactionId, ctx)
    const prompt = this.createPromptFrom(cursor.promptConfig, interaction)
    return {interaction, prompt}
  }

  /**
   * Generate an IBlockInteraction, apply `postInteractionCreate()` hooks over it,
   * generate cursor with full-fledged prompt.
   * @param block
   * @param flowId
   * @param originFlowId
   * @param originBlockInteractionId
   */
  async initializeOneBlock(block: IBlock, flowId: string, originFlowId?: string, originBlockInteractionId?: string): Promise<IRichCursor> {
    let interaction = this.createBlockInteractionFor(block, flowId, originFlowId, originBlockInteractionId)

    Object.values(this.behaviours).forEach(b => (interaction = b.postInteractionCreate(interaction, this.context)))

    return {interaction, prompt: undefined}
  }

  /**
   * Type guard providing insight into whether or not prompt presence can be relied upon.
   * @param richCursor
   */
  isRichCursorInputRequired(richCursor: IRichCursor): richCursor is IRichCursorInputRequired {
    return richCursor.prompt != null
  }

  /**
   * Apply prompt value onto IBlockInteraction, complete IBlockRunner execution, mark prompt as having been submitted,
   * apply `postInteractionComplete()` hooks over it, and return IBlockRunner's selected exit.
   * @param richCursor
   * @param block
   */
  async runActiveBlockOn(richCursor: IRichCursor, block: IBlock): Promise<IBlockExit> {
    const {interaction} = richCursor
    assertNotNull(
      interaction,
      () => 'Unable to run with absent cursor interaction',
      errorMessage => new ValidationException(errorMessage)
    )

    if (this.isRichCursorInputRequired(richCursor) && richCursor.prompt.config.isSubmitted) {
      throw new ValidationException('Unable to run against previously processed prompt')
    }

    if (this.isRichCursorInputRequired(richCursor)) {
      interaction.value = richCursor.prompt.value
      interaction.hasResponse = interaction.value != null
    }

    const exit = await this.createBlockRunnerFor(block, this.context).run(richCursor)

    this.completeInteraction(interaction, exit.uuid)

    if (this.isRichCursorInputRequired(richCursor)) {
      richCursor.prompt.config.isSubmitted = true
    }

    Object.values(this.behaviours).forEach(b => b.postInteractionComplete(richCursor.interaction, this.context))

    return exit
  }

  /**
   * Produce an IBlockRunner instance leveraging `runnerFactoryStore` and `IBlock.type`.
   * Raises when `ValidationException` when not found.
   * @param block
   * @param ctx
   */
  createBlockRunnerFor(block: IBlock, ctx: IContext): IBlockRunner {
    const factory = this.runnerFactoryStore.get(block.type)
    if (factory == null) {
      // todo: need to pass as no-op for beta
      throw new ValidationException(`Unable to find factory for block type: ${block.type}`)
    }

    return factory(block, ctx)
  }

  /**
   * Initialize a block, close off any open past interaction, push newly initialized interaction onto history stack
   * and apply new cursor onto context.
   * @param block
   * @param ctx
   */
  async navigateTo(block: IBlock, ctx: IContext): Promise<IRichCursor> {
    const richCursor = await this._inflateInteractionAndContainerCursorFor(block, ctx)

    this._activateCursorOnto(ctx, richCursor)

    await this._inflatePromptForBlockOnto(richCursor, block, ctx as IContextWithCursor)

    // todo: this could be findFirstExitOnActiveFlowBlockFor to an Expressions Behaviour
    this.cacheInteractionByBlockName(richCursor.interaction, block as IMessageBlock, ctx)

    return richCursor
  }

  _activateCursorOnto(ctx: IContext, richCursor: IRichCursor): void {
    ctx.cursor = this.dehydrateCursor(richCursor)
  }

  async _inflateInteractionAndContainerCursorFor(block: IBlock, ctx: IContext): Promise<IRichCursor> {
    const {nestedFlowBlockInteractionIdStack} = ctx
    const flowId = this._contextService.getActiveFlowIdFrom(ctx)
    const originInteractionId = last(nestedFlowBlockInteractionIdStack)
    const originInteraction = originInteractionId != null ? this._contextService.findInteractionWith(originInteractionId, ctx) : null

    const richCursor = await this.initializeOneBlock(
      block,
      flowId,
      originInteraction == null ? undefined : originInteraction.flowId,
      originInteractionId
    )

    const {interactions} = ctx
    interactions.push(richCursor.interaction)

    return richCursor
  }

  /**
   * Stepping into is the act of moving into a child flow.
   * However, we can't move into a child flow without a cursor indicating we've moved.
   * `stepInto()` needs to be the thing that discovers ya from xa (via first on flow in flows list)
   * Then generating a cursor that indicates where we are.
   * ?? -> xa ->>> ya -> yb ->>> xb
   *
   * todo: would it be possible for stepping into and out of be handled by the RunFlow itself?
   *       Eg. these are esentially RunFlowRunner's .start() + .resume() equivalents */
  stepInto(runFlowBlock: IBlock, ctx: IContext): IBlock | undefined {
    if (runFlowBlock.type !== 'Core\\RunFlow') {
      throw new ValidationException('Unable to step into a non-Core\\RunFlow block type')
    }

    const runFlowInteraction = last(ctx.interactions)
    if (runFlowInteraction == null) {
      throw new ValidationException("Unable to step into Core\\RunFlow that hasn't yet been started")
    }

    if (runFlowBlock.uuid !== runFlowInteraction.blockId) {
      throw new ValidationException("Unable to step into Core\\RunFlow block that doesn't match last interaction")
    }

    ctx.nestedFlowBlockInteractionIdStack.push(runFlowInteraction.uuid)

    const firstNestedBlock = first(this._contextService.getActiveFlowFrom(ctx).blocks)
    // todo: use IFlow.firstBlockId
    if (firstNestedBlock == null) {
      return
    }

    return firstNestedBlock
  }

  /**
   * Stepping out is the act of moving back into parent flow.
   * However, we can't move up into parent flow without a cursor indicating we've moved.
   * `stepOut()` needs to be the things that discovers xb from xa (via nfbistack)
   * Then generating a cursor that indicates where we are.
   * ?? -> xa ->>> ya -> yb ->>> xb
   *
   * @note Does this push cursor into an out-of-sync state?
   *       Not when stepping out, because when stepping out, we're connecting previous RunFlow output
   *       to next block; when stepping IN, we need an explicit navigation to inject RunFlow in between
   *       the two Flows. */
  stepOut(ctx: IContext): IBlock | undefined {
    return this.findNextBlockFrom(this.completeActiveNestedFlow(ctx), ctx)
  }

  findFirstExitOnActiveFlowBlockFor({blockId}: IBlockInteraction, ctx: IContext): IBlockExit {
    const {exits} = this._contextService.findBlockOnActiveFlowWith(blockId, ctx)
    return first(exits) as IBlockExit
  }

  /**
   * Find the active flow, then return first block on that flow if we've yet to initialize,
   * otherwise leverage current interaction's selected exit pointer.
   * @param ctx
   */
  findNextBlockOnActiveFlowFor(ctx: IContext): IBlock | undefined {
    const flow = this._contextService.getActiveFlowFrom(ctx)
    const {cursor} = ctx

    if (cursor == null) {
      // todo: use IFlow.firstBlockId
      return first(flow.blocks)
    }

    const interaction = this._contextService.findInteractionWith(cursor.interactionId, ctx)
    return this.findNextBlockFrom(interaction, ctx)
  }

  /**
   * Find next block leveraging destinationBlock on current interaction's `selectedExit`.
   * Raises when `selectedExitId` absent.
   * @param blockId
   * @param selectedExitId
   * @param ctx
   */
  findNextBlockFrom({blockId, selectedExitId}: IBlockInteraction, ctx: IContext): IBlock | undefined {
    if (selectedExitId == null) {
      // todo: maybe tighten check on this, like: prompt.isFulfilled() === false || !called block.run()
      throw new ValidationException('Unable to navigate past incomplete interaction; did you forget to call runner.run()?')
    }

    const block = this._contextService.findBlockOnActiveFlowWith(blockId, ctx)
    const {destinationBlock} = findBlockExitWith(selectedExitId, block)
    const {blocks} = this._contextService.getActiveFlowFrom(ctx)

    return find(blocks, {uuid: destinationBlock})
  }

  /**
   * Generate a concrete `IBlockInteraction` data object, pre-populated with:
   * - UUID via `IIdGenerator.generate()`
   * - entryAt via current timestamp
   * - flowId (provisioned)
   * - blockId via block.uuid
   * - type via block.type provisioned
   * - hasResponse as `false`
   * @param blockId
   * @param type
   * @param flowId
   * @param originFlowId
   * @param originBlockInteractionId
   */
  private createBlockInteractionFor(
    {uuid: blockId, type}: IBlock,
    flowId: string,
    originFlowId: string | undefined,
    originBlockInteractionId: string | undefined
  ): IBlockInteraction {
    return {
      uuid: this.idGenerator.generate(),
      blockId,
      flowId,
      entryAt: createFormattedDate(),
      exitAt: undefined,
      hasResponse: false,
      value: undefined,
      selectedExitId: undefined,
      details: {},
      type,

      // Nested flows behaviour:
      originFlowId,
      originBlockInteractionId,
    }
  }

  async _inflatePromptForBlockOnto(richCursor: IRichCursor, block: IBlock, ctx: IContextWithCursor): Promise<void> {
    richCursor.prompt = await this.buildPromptFor(block, richCursor.interaction)
    ctx.cursor.promptConfig = richCursor.prompt?.config
  }

  /**
   * Build a prompt using block's corresponding `IBlockRunner.initialize()` configurator and promptKeyToPromptConstructorMap() to
   * discover prompt constructor.
   * @param block
   * @param interaction
   */
  async buildPromptFor(block: IBlock, interaction: IBlockInteraction): Promise<TGenericPrompt | undefined> {
    const runner = this.createBlockRunnerFor(block, this.context)
    const promptConfig = await runner.initialize(interaction)
    return this.createPromptFrom(promptConfig, interaction)
  }

  /**
   * New up prompt instance from an IPromptConfig, assuming kind exists in `promptKeyToPromptConstructorMap()`,
   * resulting in null when either config or interaction are absent.
   * @param config
   * @param interaction
   */
  createPromptFrom<T>(config?: IPromptConfig<T>, interaction?: IBlockInteraction): TGenericPrompt | undefined {
    if (config == null || interaction == null) {
      return
    }

    const promptConstructor = Prompt.valueOf(config.kind)?.promptConstructor
    if (promptConstructor != null) {
      return new promptConstructor(config, interaction.uuid, this)
    } else {
      return
    }
  }
}

/**
 * Namespacing must be used, because otherwise, Builder can not be referenced, without resulting in a compiler error,
 * due to this not being able to resolve the FlowRunner.Builder type, because the Builder is transpiled to an object definition
 */
export namespace FlowRunner {
  // noinspection JSUnusedGlobalSymbols
  export class Builder {
    context?: IContext
    runnerFactoryStore: BlockRunnerFactoryStore = createDefaultBlockRunnerStore()
    idGenerator: IIdGenerator = new IdGeneratorUuidV4()
    behaviours: {[key: string]: IBehaviour} = {}
    _contextService: IContextService = ContextService

    setContext(context: IContext): FlowRunner.Builder {
      this.context = context
      return this
    }

    addBlockRunner(add: (store: BlockRunnerFactoryStore) => BlockRunnerFactoryStore): FlowRunner.Builder {
      add(this.runnerFactoryStore)
      return this
    }

    setIdGenerator(idGenerator: IIdGenerator): FlowRunner.Builder {
      this.idGenerator = idGenerator
      return this
    }

    addBehaviour(behaviourKey: string, behaviour: IBehaviour): FlowRunner.Builder {
      this.behaviours[behaviourKey] = behaviour
      return this
    }

    addCustomPrompt<T>(constructor: PromptConstructor<T>, promptKey: string): FlowRunner.Builder {
      Prompt.addCustomPrompt(constructor, promptKey)
      return this
    }

    build(): FlowRunner {
      assertNotNull(this.context, () => 'FlowRunner.Builder.setContext() must be called before FlowRunner.Builder.build()')
      return new FlowRunner(this.context, this.runnerFactoryStore, this.idGenerator, this.behaviours, this._contextService)
    }
  }
}
