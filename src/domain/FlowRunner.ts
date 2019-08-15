import IBlock, {findBlockExitWith} from '../flow-spec/IBlock'
import IContext, {
  CursorType,
  findBlockOnActiveFlowWith,
  findInteractionWith,
  getActiveFlowFrom,
  getActiveFlowIdFrom,
  IContextWithCursor,
  RichCursorInputRequiredType,
  RichCursorType,
} from '../flow-spec/IContext'
import IBlockRunner from './runners/IBlockRunner'
import IBlockInteraction from '../flow-spec/IBlockInteraction'
import IBlockExit from '../flow-spec/IBlockExit'
import {find, first, last} from 'lodash'
import uuid from 'uuid'
import IFlowRunner, {IBlockRunnerFactoryStore} from './IFlowRunner'
import ValidationException from './exceptions/ValidationException'
import IPrompt, {IBasePromptConfig, IPromptConfig} from './prompt/IPrompt'
import NumericPrompt from './prompt/NumericPrompt'
import {INumericPromptConfig} from './prompt/INumericPromptConfig'

/**
 * todo: remaining pieces
 *       - build out numeric prompt
 *       - complete run-flow-block runner
 *       - usage documentation
 */

export class BlockRunnerFactoryStore
  extends Map<string, { (block: IBlock): IBlockRunner }>
  implements IBlockRunnerFactoryStore {
}

export default class implements IFlowRunner {
  constructor(
    public context: IContext,
    public runnerFactoryStore: IBlockRunnerFactoryStore) {
  }

  /**
   * We want to call start when we don't have a prompt needing work to be done. */
  initialize(): RichCursorType | null {
    const block = this.findNextBlockOnActiveFlowFor(this.context)
    if (block == null) {
      throw new ValidationException('Unable to initialize flow without blocks.')
    }

    // todo: set flow starting timestamp on context
    // todo: set delivery status on context

    return this.navigateTo(block, this.context) // kick-start by navigating to first block
  }

  isInitialized(ctx: IContext): boolean {
    // const {cursor, entryAt, exitAt} = ctx
    // return cursor && entryAt && !exitAt

    return ctx.cursor != null
  }

  /**
   * We want to call resume when we have a prompt needing work to be wrapped up on it.
   *
   * I'm wondering if these need to be treated differently. The concern is that resume _assumes_ a particular state;
   * eg. cursor with a prompt requiring input
   *
   * The issue is that we may, in fact, end up needing to resume from a state where a particular block
   *    got itself into an invalid state and _crashed_, in which case, we'd still want the ability to pick up
   *    where we'd left off. */
  run(): RichCursorInputRequiredType | null {
    const {context: ctx} = this
    if (!this.isInitialized(ctx)) {
      /* const richCursor = */
      this.initialize()
    }

    return this.runUntilInputRequiredFrom(ctx as IContextWithCursor)
  }

  isInputRequiredFor(ctx: IContext): false | boolean /* : ctx is RichCursorInputRequiredType*/ {
    return (ctx.cursor != null && ctx.cursor[1] != null && !ctx.cursor[1].isSubmitted)
  }

  runUntilInputRequiredFrom(ctx: IContextWithCursor): RichCursorInputRequiredType | null {
    /* todo: convert cursor to an object instead of tuple; since we don't have named tuples, a dictionary
        would be more intuitive */
    let richCursor: RichCursorType = this.hydrateRichCursorFrom(ctx)
    let block: IBlock | undefined = findBlockOnActiveFlowWith(richCursor[0].blockId, ctx)

    do {
      if (this.isInputRequiredFor(ctx)) {
        console.info('Attempted to resume when prompt is not yet fulfilled; resurfacing same prompt instance.')
        return richCursor as RichCursorInputRequiredType
      }

      this.runActiveBlockOn(richCursor, block)

      block = this.findNextBlockOnActiveFlowFor(ctx)

      if (block == null) {
        block = this.stepOut(ctx)
      }

      if (block == null) {
        continue // bail-- we're done.
      }

      if (block.type === 'Core\\RunFlowBlock') {
        richCursor = this.navigateTo(block, ctx)
        block = this.stepInto(block, ctx)
      }

      if (block == null) {
        continue // bail-- we done.
      }

      richCursor = this.navigateTo(block, ctx)

    } while (block != null)

    this.complete(ctx)

    return null
  }

  // exitEarlyThrough(block: IBlock) {
    // todo: generate link from current interaction to exit block (flow.exitBlockId)
    // todo: raise if flow.exitBlockId not defined
    // todo: set delivery status on context as INCOMPLETE
  // }

  complete(ctx: IContext) {
    // todo: set exitAt on context
    // todo: set delivery status on context as COMPLETE

    (last(ctx.interactions) as IBlockInteraction).exitAt = new Date
    delete ctx.cursor
  }

  dehydrateCursor(richCursor: RichCursorType): CursorType {
    return [richCursor[0].uuid, richCursor[1] != null ? richCursor[1].config : null]
  }

  hydrateRichCursorFrom(ctx: IContextWithCursor): RichCursorType {
    /**
     * todo: to properly facilitate json-ification of any given `ctx`, we'll want this to also hydrate
     *       `cursor[1]<IPrompt>` from an underlying data structure here
     * todo: to facilitate an alternate underlying data structure for Prompt, let's add
     *       ```
     *       runner.createPromptFromCursor(): IPrompt<IPromptExpectationTypes> | null
     *       ```
     *       - There is one additional complication with toggling between these two: We now need to type our IPromptConfig?
     *         As in, we'll likely want to return a config definition from our block runner, but have the instantiation
     *         handled by the runner? Another site for type injection.
     *       - Cursor would then hold a union type of the different config types we know of where config has a type
     **/
    const {cursor} = ctx
    return [findInteractionWith(cursor[0], ctx), this.createPromptFrom(cursor[1])]
  }

  initializeOneBlock(
    block: IBlock,
    flowId: string,
    originFlowId?: string,
    originBlockInteractionId?: string,
  ): RichCursorType {
    const runner = this.createBlockRunnerFor(block)
    const interaction = this.createBlockInteractionFor(block, flowId, originFlowId, originBlockInteractionId)
    const promptConfig = runner.initialize(interaction)
    const prompt = this.createPromptFrom(promptConfig)

    return [interaction, prompt]
  }

  runActiveBlockOn(richCursor: RichCursorType, block: IBlock): IBlockExit {
    // todo: write test to guard against already isSubmitted at this point

    if (richCursor[1] != null) {
      richCursor[0].value = richCursor[1].value
    }

    const exit = this.createBlockRunnerFor(block)
      .run(richCursor)

    richCursor[0].details.selectedExitId = exit.uuid

    if (richCursor[1] != null) {
      richCursor[1].config.isSubmitted = true
    }

    return exit
  }

  createBlockRunnerFor(block: IBlock): IBlockRunner {
    const factory = this.runnerFactoryStore.get(block.type)
    if (factory == null) { // todo: need to pass as no-op for beta
      throw new ValidationException(`Unable to find factory for block type: ${block.type}`)
    }

    return factory(block)
  }

  navigateTo(block: IBlock, ctx: IContext): RichCursorType {
    const {interactions, nestedFlowBlockInteractionIdStack} = ctx
    const flowId = getActiveFlowIdFrom(ctx)
    const originInteractionId = last(nestedFlowBlockInteractionIdStack)
    const originInteraction = originInteractionId != null
      ? findInteractionWith(originInteractionId, ctx)
      : null

    const richCursor = this.initializeOneBlock(
      block,
      flowId,
      originInteraction == null ? undefined : originInteraction.flowId,
      originInteractionId)

    const lastInteraction = last(interactions)
    if (lastInteraction != null) {
      lastInteraction.exitAt = new Date
    }

    interactions.push(richCursor[0])
    ctx.cursor = this.dehydrateCursor(richCursor)

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
      throw new ValidationException('Unable to step into Core\\RunFlow that hasn\'t yet been started')
    }

    if (runFlowBlock.uuid !== runFlowInteraction.blockId) {
      throw new ValidationException('Unable to step into Core\\RunFlow block that doesn\'t match last interaction')
    }

    ctx.nestedFlowBlockInteractionIdStack.push(runFlowInteraction.uuid)

    const firstNestedBlock = first(getActiveFlowFrom(ctx).blocks) // todo: use IFlow.firstBlockId
    if (firstNestedBlock == null) {
      return undefined
    }

    if (runFlowBlock.exits.length === 1) {
      // todo: how does clipboard-web do this? Seems problematic if we were to ever refetch this flow
      runFlowBlock.exits.push(this.createBlockExitFor(firstNestedBlock))
    }

    runFlowInteraction.details.selectedExitId = (last(runFlowBlock.exits) as IBlockExit).uuid

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
    const {interactions, nestedFlowBlockInteractionIdStack} = ctx

    if (nestedFlowBlockInteractionIdStack.length == 0) {
      return undefined
    }

    const lastParentInteractionId = nestedFlowBlockInteractionIdStack.pop() as string
    const {blockId: lastRunFlowBlockId} = findInteractionWith(lastParentInteractionId, ctx)
    const lastRunFlowBlock = findBlockOnActiveFlowWith(lastRunFlowBlockId, ctx)
    const {uuid: runFlowBlockFirstExitId, destinationBlock} = first(lastRunFlowBlock.exits) as IBlockExit

    (last(interactions) as IBlockInteraction).details.selectedExitId = runFlowBlockFirstExitId

    return findBlockOnActiveFlowWith(destinationBlock, ctx)
  }

  findNextBlockOnActiveFlowFor(ctx: IContext): IBlock | undefined {
    // cursor: RichCursorType | null, flow: IFlow): IBlock | null {
    const flow = getActiveFlowFrom(ctx)
    const {cursor} = ctx

    if (cursor == null) {
      return first(flow.blocks) // todo: use IFlow.firstBlockId
    }

    const interaction = findInteractionWith(cursor[0], ctx)
    return this.findNextBlockFrom(interaction, ctx)
  }

  findNextBlockFrom(interaction: IBlockInteraction, ctx: IContext): IBlock | undefined {
    if (interaction.details.selectedExitId == null) {
      // todo: maybe tighter check on this, like: prompt.isFulfilled() === false || !called block.run()
      throw new ValidationException('Unable to navigate past incomplete interaction; did you forget to call runner.run()?')
    }

    const block = findBlockOnActiveFlowWith(interaction.blockId, ctx)
    const {destinationBlock} = findBlockExitWith(interaction.details.selectedExitId, block)
    const {blocks} = getActiveFlowFrom(ctx)

    return find(blocks, {uuid: destinationBlock})
  }

  private createBlockInteractionFor(
    {uuid: blockId}: IBlock,
    flowId: string,
    originFlowId: string | undefined = undefined,
    originBlockInteractionId: string | undefined = undefined): IBlockInteraction {

    return {
      uuid: uuid.v4(),
      blockId,
      flowId,
      entryAt: new Date,
      exitAt: undefined,
      hasResponse: false,
      value: undefined,
      details: {selectedExitId: null},
      type: null, // (?) -- awaiting response from @george + @mark on this

      // Nested flows:
      originFlowId,
      originBlockInteractionId,
    }
  }

  private createBlockExitFor({uuid: destinationBlock}: IBlock): IBlockExit {
    return {
      uuid: uuid.v4(),
      destinationBlock: destinationBlock,
      config: {},
      label: '',
      semanticLabel: '',
      tag: '',
      test: '',
    }
  }

  private createPromptFrom(config?: IPromptConfig<any> | null): IPrompt<IPromptConfig<any> & IBasePromptConfig> | undefined {
    if (config == null) {
      return undefined
    }

    return new NumericPrompt(
      {} as IBlock,
      {} as IBlockInteraction,
      config as INumericPromptConfig & IBasePromptConfig)
  }
}