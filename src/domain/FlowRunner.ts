import IBlock, {findBlockExitWith} from "../flow-spec/IBlock"
import IContext, {
  findBlockOnActiveFlowWith,
  findInteractionWith,
  getActiveFlowFrom,
  getActiveFlowIdFrom,
  IContextInputRequired,
  IContextWithCursor,
  RichCursorInputRequiredType,
  RichCursorType
} from "../flow-spec/IContext"
import IBlockRunner from "./runners/IBlockRunner"
import IBlockInteraction from "../flow-spec/IBlockInteraction"
import IBlockExit from "../flow-spec/IBlockExit"
import {find, first, last} from 'lodash'
import uuid from 'uuid'

/**
 * todo: remaining pieces
 *       - build out numeric prompt
 *       - complete message block runner
 *       - complete run-flow-block runner
 *       - simplify test datasets???
 *       - usage documentation
 */

export default class {
  constructor(
      public context: IContext,
      public runnerFactoryStore: Map<string, {(block: IBlock): IBlockRunner}>) {}

  /**
   * We want to call start when we don't have a prompt needing work to be done. */
  start(): RichCursorInputRequiredType | null {
    return this.runUntilInputRequiredFrom(this.context)
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
  resume() {
    return this.resumeFrom(this.context as IContextWithCursor)
  }

  runUntilInputRequiredFrom(ctx: IContext): RichCursorInputRequiredType | null {
    // todo: convert cursor to an object instead of tuple; since we don't have named tuples, a dictionary would be more intuitive

    let block: IBlock | null

    do {
      if (ctx.cursor && ctx.cursor[1] && !ctx.cursor[1].isSubmitted) {
        console.log('Attempted to resume when prompt is not yet fulfilled; resurfacing same prompt instance.')
        return this.createRichCursorInputRequiredFrom(ctx as IContextInputRequired)
      }

      block = this.findNextBlockOnActiveFlowFor(ctx)

      if (!block) {
        block = this.stepOut(ctx)
      }

      if (!block) {
        continue // bail-- we're done.
      }

      if (block.type === 'Core\\RunFlowBlock') {
        /*[interactionUuid, prompt] = */this.navigateTo(block, ctx)
        block = this.stepInto(block, ctx)
      }

      if (!block) {
        continue // bail-- we done.
      }

      /*[interactionUuid, prompt] = */this.navigateTo(block, ctx)

    } while (block)

    delete ctx.cursor
    return null
  }

  createRichCursorInputRequiredFrom(ctx: IContextInputRequired): RichCursorInputRequiredType {
    const {cursor} = ctx
    return [findInteractionWith(cursor[0], ctx), cursor[1]]
  }

  resumeFrom(ctx: IContextWithCursor) {
    const
        interaction = findInteractionWith(ctx.cursor[0], ctx),
        block = findBlockOnActiveFlowWith(interaction.blockId, ctx)

    /*const exit = */this.resumeOneBlock(block, ctx as IContextInputRequired)
    return this.runUntilInputRequiredFrom(ctx)
  }

  startOneBlock(block: IBlock, flowId: string, originFlowId: string | null, originBlockInteractionId: string | null): RichCursorType {
    const
        runner = this.createBlockRunnerFor(block),
        interaction = this._createBlockInteractionFor(block, flowId, originFlowId, originBlockInteractionId),
        prompt = runner.start(interaction)

    return [interaction, prompt]
  }

  resumeOneBlock(block: IBlock, ctx: IContextInputRequired): IBlockExit {
    return this.createBlockRunnerFor(block)
        .resume(this.createRichCursorInputRequiredFrom(ctx)) // todo: resume() needs to set "prompt.isSubmitted"
  }

  createBlockRunnerFor(block: IBlock): IBlockRunner {
    const factory = this.runnerFactoryStore.get(block.type)
    if (!factory) {
      throw new Error(`Unable to find factory for block type: ${block.type}`)
    }

    return factory(block)
  }

  _createBlockInteractionFor(
      {uuid: blockId}: IBlock,
      flowId: string,
      originFlowId: string | null = null,
      originBlockInteractionId: string | null = null): IBlockInteraction {

    return {
      uuid: uuid.v4(),
      blockId,
      flowId,
      entryAt: new Date,
      exitAt: null,
      hasResponse: false,
      value: null,
      details: {selectedExitId: null},
      type: null, // (?) -- awaiting response from @george + @mark on this

      // Nested flows:
      originFlowId,
      originBlockInteractionId,
    }
  }

  _createBlockExitFor({uuid: destination_block}: IBlock): IBlockExit {
    return {
      uuid: uuid.v4(),
      destination_block,
      config: {},
      label: '',
      semantic_label: '',
      tag: '',
      test: ''
    }
  }

  navigateTo(block: IBlock, ctx: IContext) {
    const
        {interactions, nestedFlowBlockInteractionIdStack} = ctx,
        flowId = getActiveFlowIdFrom(ctx),
        originInteractionId = last(nestedFlowBlockInteractionIdStack) || null,
        originInteraction = originInteractionId
            ? findInteractionWith(originInteractionId, ctx)
            : null

    const [interaction, prompt] = this.startOneBlock(
        block,
        flowId,
        originInteraction && originInteraction.flowId,
        originInteractionId)

    const lastInteraction = last(interactions)
    if (lastInteraction) {
      interaction.exitAt = new Date
    }

    interactions.push(interaction)

    return ctx.cursor = [interaction.uuid, prompt]
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
  stepInto(runFlowBlock: IBlock, ctx: IContext): IBlock | null {
    if (runFlowBlock.type !== 'Core\\RunFlow') {
      throw new Error('Unable to step into a non-Core\\RunFlow block type')
    }

    const runFlowInteraction = last(ctx.interactions)
    if (!runFlowInteraction) {
      throw new Error('Unable to step into Core\\RunFlow that hasn\'t yet been started')
    }

    ctx.nestedFlowBlockInteractionIdStack.push(runFlowInteraction.uuid)

    const firstNestedBlock = first(getActiveFlowFrom(ctx).blocks) || null
    if (!firstNestedBlock) {
      return null
    }

    if (runFlowBlock.exits.length === 1) {
      // todo: how does clipboard-web do this? Seems problematic if we were to ever refetch this flow
      runFlowBlock.exits.push(this._createBlockExitFor(firstNestedBlock))
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
   * Does this push cursor into an out-of-sync state?
   * Not when stepping out, because when stepping out, we're connecting previous RunFlow output
   * to next block; when stepping IN, we need an explicit navigation to inject RunFlow in between
   * the two Flows. */
  stepOut(ctx: IContext): IBlock | null {
    const {interactions, nestedFlowBlockInteractionIdStack} = ctx

    if (!nestedFlowBlockInteractionIdStack.length) {
      return null
    }

    const
        lastParentInteractionId = nestedFlowBlockInteractionIdStack.pop() as string,
        {blockId: lastRunFlowBlockId} = findInteractionWith(lastParentInteractionId, ctx),
        lastRunFlowBlock = findBlockOnActiveFlowWith(lastRunFlowBlockId, ctx),
        {uuid: runFlowBlockFirstExitId, destination_block} = first(lastRunFlowBlock.exits) as IBlockExit

    (last(interactions) as IBlockInteraction).details.selectedExitId = runFlowBlockFirstExitId

    return findBlockOnActiveFlowWith(destination_block, ctx)
  }

  findNextBlockOnActiveFlowFor(ctx: IContext): IBlock | null {//cursor: RichCursorType | null, flow: IFlow): IBlock | null {
    const
        flow = getActiveFlowFrom(ctx),
        {cursor} = ctx

    if (!cursor) {
      return first(flow.blocks) || null
    }

    const interaction = findInteractionWith(cursor[0], ctx)
    return this.findNextBlockFrom(interaction, ctx)
  }

  findNextBlockFrom(interaction: IBlockInteraction, ctx: IContext): IBlock | null {
    if (!interaction.details.selectedExitId) {
      throw new Error('Unable to navigate past incomplete interaction; did you forget to call runner.resume()?') // eg. prompt.isFulfilled() === false || !called block.resume()
    }

    const
        block = findBlockOnActiveFlowWith(interaction.blockId, ctx),
        {destination_block} = findBlockExitWith(interaction.details.selectedExitId, block),
        {blocks} = getActiveFlowFrom(ctx)

    return find(blocks, {uuid: destination_block}) || null
  }
}
