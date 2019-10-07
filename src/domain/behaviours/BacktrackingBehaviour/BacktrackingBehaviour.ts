import {
  cloneDeep,
  findLastIndex,
  isEqual,
  last,
} from 'lodash'
import IBehaviour from '../IBehaviour'
import IBlockInteraction from '../../../flow-spec/IBlockInteraction'
import IContext, {findBlockOnActiveFlowWith, IContextWithCursor, RichCursorType} from '../../../flow-spec/IContext'
import {
  _append,
  _loop,
  createStack,
  createStackKey,
  findHeadRightFrom,
  getEntityAt,
  getIterationFor,
  getStackFor,
  IStack,
  Key,
  shallowIndexOfRightFrom,
  STACK_KEY_ITERATION_INDEX,
  createStackKeyForLastIterAndLastIndexOf,
  StackKey,
  moveStackIndexTo,
  createKey,
  deepTruncateIterationsFrom,
  deepIndexOfFrom,
  forceGet,
  isEntity,
  truncateIterationFrom,
  STACK_KEY_ITERATION_NUMBER,
  cloneKeyAndMoveTo,
} from './HierarchicalIterStack'
import ValidationException from '../../exceptions/ValidationException'
import {IFlowNavigator} from '../../FlowRunner'

export interface IBacktrackingContext {
  /**
   * Current key into interaction hierarchy */
  cursor: Key
  /**
   * Hierarchical list of interactions */
  interactionStack: IStack
  /**
   * Ghost list of interactions; we follow this stack when stepping forward after a backtrack to receive suggestions. */
  ghostInteractionStack?: IStack
}

export interface IContextBacktrackingPlatformMetadata {
  backtracking: IBacktrackingContext
}

type BacktrackingCursor = IBacktrackingContext['cursor']
type BacktrackingIntxStack = IBacktrackingContext['interactionStack']

export default class BacktrackingBehaviour implements IBehaviour {
  constructor(
    public context: IContext,
    public navigator: IFlowNavigator) {

    this.initializeBacktrackingContext()
  }

  initializeBacktrackingContext() {
    const meta: IContextBacktrackingPlatformMetadata = this.context.platformMetadata as IContextBacktrackingPlatformMetadata

    if (meta.backtracking == null) {
      meta.backtracking = {
        cursor: createKey(),
        interactionStack: createStack()}
    }

    if (meta.backtracking.interactionStack == null
      || meta.backtracking.cursor == null) {
      meta.backtracking.cursor = createKey()
      meta.backtracking.interactionStack = createStack()
      this.rebuildIndex()
    }
  }

  hasIndex() {
    const meta: IContextBacktrackingPlatformMetadata = this.context.platformMetadata as IContextBacktrackingPlatformMetadata
    return meta.backtracking.interactionStack != null
      && meta.backtracking.cursor != null
  }

  rebuildIndex() {
    const {
      backtracking,
    } = this.context.platformMetadata as IContextBacktrackingPlatformMetadata

    const key = backtracking.cursor = createKey()
    const stack = backtracking.interactionStack = createStack()

    this.context.interactions.forEach(intx => this.insertInteractionUsing(key, intx, stack))
  }

  insertInteractionUsing(key: BacktrackingCursor, interaction: IBlockInteraction, interactionStack: BacktrackingIntxStack): void {
    // check: are we repeating anything?
    const keyForIntxOfRepeatedBlock = shallowIndexOfRightFrom(key, interactionStack, intx => (intx as IBlockInteraction).blockId === interaction.blockId)
    if (keyForIntxOfRepeatedBlock != null) {
      // [Step In] Found a new stack to step into
      this._stepIn(key, interactionStack, keyForIntxOfRepeatedBlock, interaction)
      return
    }

    // check if any parent stacks start with a matching block; included current stack, but that should be caught above
    const keyToBeginningOfStackWithHeadMatchingBlock = findHeadRightFrom(key, interactionStack, intx => (intx as IBlockInteraction).blockId === interaction.blockId)
    if (keyToBeginningOfStackWithHeadMatchingBlock != null) {
      // [Step Out] Found an stack to continue on from
      this._stepOut(keyToBeginningOfStackWithHeadMatchingBlock, interactionStack, interaction, key)
      return
    }

    // push onto current stack + update key with new size - 1
    last(key)![STACK_KEY_ITERATION_INDEX] = _append(interaction, getStackFor(key, interactionStack)) - 1
  }

  _stepOut(keyToBeginningOfStackWithHeadMatchingBlock: Key,
           interactionStack: BacktrackingIntxStack,
           interaction: IBlockInteraction,
           key: BacktrackingCursor) {

    const stack: IStack = getStackFor(keyToBeginningOfStackWithHeadMatchingBlock, interactionStack)
    _loop(stack, [interaction])

    const newStackKey: StackKey = createStackKeyForLastIterAndLastIndexOf(stack)
    moveStackIndexTo(newStackKey, keyToBeginningOfStackWithHeadMatchingBlock)

    key.splice(0, Number.MAX_VALUE, ...keyToBeginningOfStackWithHeadMatchingBlock)
  }

  _stepIn(key: BacktrackingCursor,
          interactionStack: BacktrackingIntxStack,
          keyForIntxOfRepeatedBlock: Key,
          interaction: IBlockInteraction) {

    const iteration = getIterationFor(key, interactionStack)
    const i = last(keyForIntxOfRepeatedBlock)![STACK_KEY_ITERATION_INDEX] // todo: abstract key operations

    // take from i to the end
    const nestedIteration = iteration.splice(i)

    // append taken items (returned); append [intx]
    const nestedStack = createStack(nestedIteration)
    iteration.push(nestedStack) // append onto parent <-- todo: update head! // todo: let's use _append() here
    _loop(nestedStack, [interaction])

    // update key like: replace current key w/ found index; append [1 (new stack), 1 (second iteration)]
    last(key)![STACK_KEY_ITERATION_INDEX] = i
    key.push(createStackKey(1, 0))
  }

    // we jump to a particular interaction
    // which updates context.interactions
    // the only piece that's missing is updating the cursor, because we're already initialized everything
    // we only need to regenerate the prompt for this particular interaction
    // once the prompt is generated, then we can set that on the context as our new cursor
    //
    // everything else regarding hierarchical cursors has been handled already
    //
    // so the hook that we need is basically the second half of initializeOneBlock()
    // there's a weird thing here, where if we were to call initializeOneBlock
    //  we'd get a new interaction
    //  and our postCreateInteraction would get called --- except, we wouldn't really know where it's getting called FROM
    //
    //
    //
    // FlowRunner.navigateTo(block: IBlock, ctx: IContext)
    //
    //     -> FlowRunner.initializeOneBlock(
    //             block: IBlock,
    //             flowId: string,
    //             originFlowId?: string,
    //             originBlockInteractionId?: string)
    //
    //         -> behaviours.postInteractionCreate(): IBlockInteraction
    //
    //
    //
    // Now, we run into the issue where jumping back to a place that should step out of our nestedFlow stack breaks things
    // -> nestedFlowBlockInteractionIdStack
    //     -> when jumpTo()-ing: need to pop these off until flowId matches
    //
    // Question: when calling jumpTo() from the outside, what does that UX look like? And how does that tie nav() + init() + post() together?
    //
    // If we reuse navigate to, then we get interaction.push(), lastIntx.exitAt, ctx.cursor, return richCursor all for free
    //   - last.exitAt is a bit of an issue, but we can always use backtracking-meta on intx to store originalExitAt .



  jumpTo(interaction: IBlockInteraction, context: IContext): RichCursorType {
    const {
      backtracking,
    } = this.context.platformMetadata as IContextBacktrackingPlatformMetadata

    // find a key for provided past interaction
    const keyForLastOccurrenceOfInteraction = deepIndexOfFrom(
      createKey(), // begins search from beginning -- todo: search from right?
      backtracking.interactionStack,
      ({uuid}) => uuid === interaction.uuid)

    if (keyForLastOccurrenceOfInteraction == null) {
      throw new ValidationException('Unable to find destination interaction in backtracking stack for jumpTo()')
    }


    // todo: if something hasn't changed, can we extend this ghost rather than creating anew?



    // create ghost stack to follow after jumping back
    backtracking.ghostInteractionStack = cloneDeep(backtracking.interactionStack)

    // jump context.interactions back in time
    context.interactions.splice( // truncate interactions list to pull us back in time; including provided intx
      findLastIndex(context.interactions, interaction),
      context.interactions.length)

    // todo: implement nestedFlowInteractionIdStack stripper
    // - pop interactions off this stack until (length <= 0 || interaction.flowId === x.flowId).
    // - this doesn't work for loops within loops, does it?
    // - eg. flow a -> flow b -> flow c -> flow a -> flow b -> flow c
    //       - if we backtrack to interaction on first flow b, we're only going to pop these a single stack back
    //       - however, we do have our `context.interactions` that we can search for run-flow blocks and pop accordingly
    //         while running from right

    // update interactionStack to match

    // todo: should this truncate be inclusive or exclusive?
    //       - it should remove found interaction; aka point should result in none; how does this change references to backtracking.cursor thenceforth?

    const deepestStackKeyForIntx = last(keyForLastOccurrenceOfInteraction)!
    const keyToTruncateFrom = cloneKeyAndMoveTo(
      createStackKey(
        deepestStackKeyForIntx[STACK_KEY_ITERATION_NUMBER],
        deepestStackKeyForIntx[STACK_KEY_ITERATION_INDEX] - 1), // slide left one so that we free current spot up
      keyForLastOccurrenceOfInteraction,
      backtracking.interactionStack)

    deepTruncateIterationsFrom(keyToTruncateFrom, backtracking.interactionStack)

    // set backtracking cursor to match
    backtracking.cursor = keyToTruncateFrom // keyForLastOccurrenceOfInteraction // todo: this now points at a null; should it be `keyToTruncateFrom`?







    // todo: This navigateTo() is going to append an interaction onto context.interactions --> verify that context.interactions.splice() accounts for that

    return this.navigator.navigateTo(
      findBlockOnActiveFlowWith(interaction.blockId, this.context),
      this.context)
  }

  peek(steps: number = 1) {
    // todo: this will wrap richCursor creation, something like: ```
    //       ctx = {cursor: [interactionId, createPromptConfig(intx)]}
    //       return this.cursorHydrator.hydrateRichCursorFrom(ctx: IContextWithCursor)
    //       ```
  }

  findIndexOfSuggestionFor({blockId}: IBlockInteraction, key: Key, stack: IStack): Key | undefined {
    const keyForSuggestion = deepIndexOfFrom(key, stack, intx => (intx as IBlockInteraction).blockId === blockId)

    if (keyForSuggestion != null) {
      return keyForSuggestion
    }

    // also scan next iteration when we're on last index of current iteration
    const lastIndexOfIteration = getIterationFor(key, stack).length - 1
    const shouldCheckNextIteration = last(key)![STACK_KEY_ITERATION_INDEX] === lastIndexOfIteration
    if (!shouldCheckNextIteration) {
      return
    }

    const keyForNextIteration = moveStackIndexTo(createStackKey(0, 0), cloneDeep(key)) // todo: use cloneKeyAndMoveTo()
    return deepIndexOfFrom(keyForNextIteration, stack, intx => (intx as IBlockInteraction).blockId === blockId)
  }

  postInteractionCreate(interaction: IBlockInteraction, _context: IContext): void {
    const {
      backtracking: {
        cursor: key,
        interactionStack,
        ghostInteractionStack
      }} = this.context.platformMetadata as IContextBacktrackingPlatformMetadata

    if (ghostInteractionStack == null) { // can't suggest when we don't have ghost interactions from the past
      return
    }

    if (!this.hasIndex()) {
      this.rebuildIndex()
    }

    const keyForSuggestion = this.findIndexOfSuggestionFor(interaction, key, interactionStack)
    if (keyForSuggestion == null) {
      return
    }

    interaction.value = (getEntityAt(keyForSuggestion, interactionStack) as IBlockInteraction).value

    // need to splice out things between key + keyForSuggestion so that key points to both interaction and suggestion
    if (keyForSuggestion.join() !== key.join()) {
      this.syncGhost(key, keyForSuggestion, ghostInteractionStack)
    }
  }

  /**
   * A hierarchical deep splice to remove items between two keys, hoisting deepest iteration to main depth.
   * ghost=[[0, 1], [1, 3], [0, 1], [1, 2]]
   * main=[[0, 1], [1, 4]] */
  syncGhost(keyForSuggestion: Key, key: Key, ghost: IStack) {//: Key {
    // todo: refactor this into stack::deepSplice(): Item[]
    //       if we provide items (remainderOfCurrentGhostIteration), this becomes two logical pieces splice() + deepSplice()

    if (keyForSuggestion.length < key.length) {
      throw new ValidationException(`Unable to sync up ghost; ${JSON.stringify({key, keyForSuggestion})}`)
    }

    if (keyForSuggestion.length === key.length && keyForSuggestion.toString() === key.toString()) {
      return //keyForSuggestion
    }

    let isAtGreaterDepth = keyForSuggestion.length > key.length
    let stackKeyForSuggestion: StackKey = last(keyForSuggestion)!
    // find our keepers = remainderOfCurrentGhostIteration
    const iterationForSuggestion = getIterationFor(keyForSuggestion, ghost)
    const remainderOfCurrentGhostIteration = iterationForSuggestion.slice(stackKeyForSuggestion[STACK_KEY_ITERATION_INDEX])

    // discard iterations up to + including one with keepers
    if (isAtGreaterDepth) {
      const {stack} = getStackFor(keyForSuggestion, ghost)
      stack.splice(0, stackKeyForSuggestion[STACK_KEY_ITERATION_NUMBER] + 1)
      keyForSuggestion.pop() // update suggestion key to point to containing stack
    }

    // splice keepers onto containing stack at suggestedKeyIterAndIndex; discarding # of items between
    stackKeyForSuggestion = last(keyForSuggestion)!
    const containingIterationForSuggestion = getIterationFor(keyForSuggestion, ghost)
    isAtGreaterDepth = keyForSuggestion.length > key.length
    const itemsBetweenKeyAndGhost = isAtGreaterDepth
      ? 0 // when still different depth(post-pop())
      : (stackKeyForSuggestion[STACK_KEY_ITERATION_INDEX] - last(key)![STACK_KEY_ITERATION_INDEX]) // {sugKey's index} - {key's index} when same depth

    containingIterationForSuggestion.splice(
      stackKeyForSuggestion[STACK_KEY_ITERATION_NUMBER],
      itemsBetweenKeyAndGhost,
      ...remainderOfCurrentGhostIteration)

    // when still at greater depth: repeat the ordeal
    if (isAtGreaterDepth) {
      this.syncGhost(keyForSuggestion, key, ghost)
    }
  }

  postInteractionComplete(interaction: IBlockInteraction, _context: IContext): void {
    const {
      backtracking: {
        cursor: key,
        interactionStack,
        ghostInteractionStack
      }} = this.context.platformMetadata as IContextBacktrackingPlatformMetadata

    this.insertInteractionUsing(key, interaction, interactionStack)

    if (ghostInteractionStack == null) { // can't suggest when we don't have ghost interactions from the past
      return
    }

    // update ghost to account for changes while stepping forward
    const ghostIntx = forceGet(key, ghostInteractionStack) // todo: this should actually be a deepFindFrom() w/in current iteration
    // when ghost is absent or ghost value matches
    if (!isEntity(ghostIntx)
      || isEqual(interaction.value, (ghostIntx as IBlockInteraction).value)) {
      return // do nothing
    }

    // when interaction's value differs from interaction@ghost's value
    // remove the possibility of suggesting from future -- todo: verify this logic -- can we be this destructive?

    // assumption: keys point to same points in both ghost and main stacks
    truncateIterationFrom(key, ghostInteractionStack) // todo: should this be inclusive or exclusive?
  }
}
