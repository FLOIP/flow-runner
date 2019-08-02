import IBlock, {findBlockExitWith} from "../flow-spec/IBlock"
import IContext, {
  findBlockOnActiveFlowWith,
  findInteractionWith, getActiveFlowFrom, getActiveFlowIdFrom,
  IContextInputRequired, IContextWithCursor,
  RichCursorInputRequiredType,
  RichCursorType
} from "../flow-spec/IContext"
import IBlockRunner from "./runners/IBlockRunner"
import IBlockInteraction from "../flow-spec/IBlockInteraction"
import IBlockExit from "../flow-spec/IBlockExit"
import {find, first, last} from 'lodash'
import uuid from 'uuid'
import MessageBlockRunner from "./runners/MessageBlockRunner";

/**
 * todo: remaining pieces
 *       - provide block runner factory store
 *       - build out numeric prompt
 *       - complete message block runner
 *       - complete run-flow-block runner
 *       - simplify test datasets???
 *       - usage documentation
 */

export default class {
  constructor(
      public context: IContext) {}

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


        // todo: do we need to connect selected exits here?


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
        interaction = this.createBlockInteractionFor(block, flowId, originFlowId, originBlockInteractionId),
        prompt = runner.start(interaction)

    return [interaction, prompt]
  }

  resumeOneBlock(block: IBlock, ctx: IContextInputRequired): IBlockExit {
    return this.createBlockRunnerFor(block)
        .resume(this.createRichCursorInputRequiredFrom(ctx)) // todo: resume() needs to set "prompt.isSubmitted"
  }

  createBlockRunnerFor(block: IBlock): IBlockRunner {
    // todo raise exception when runner for this block is absent

    // todo: how do we define capabilities + available runners? likely provide a FactoryStore<{(block: IBlock) => IBlockRunner}>
    // const factory = this.runners.get(block.type)
    // return factory(block)
    return new MessageBlockRunner(block)
  }

  createBlockInteractionFor(
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
      details: {selectedExitId: null}, // todo: when does this get set for nested flows?
      type: null, // (?) -- awaiting response from @george + @mark on this

      // Nested flows:
      originFlowId,
      originBlockInteractionId,
    }
  }

  navigateTo(block: IBlock, ctx: IContext) {
    const
        flowId = getActiveFlowIdFrom(ctx),
        originInteractionId = last(ctx.nestedFlowBlockInteractionStack) || null,
        originInteraction = originInteractionId
            ? findInteractionWith(originInteractionId, ctx)
            : null

    const [interaction, prompt] = this.startOneBlock(
        block,
        flowId,
        originInteraction && originInteraction.flowId,
        originInteractionId)

    // append interaction for block to @interactions
    ctx.interactions.push(interaction)
    // update cursor to reflect new interaction's id and prompt (when prompt provided, null when absent)
    return ctx.cursor = [interaction.uuid, prompt]
  }

  /**
   * Stepping into is the act of moving into a child tree.
   * However, we can't move into a child tree without a cursor indicating we've moved.
   * `stepInto()` needs to be the thing that discovers ya from xa (via first on flow in flows list)
   * Then generating a cursor that indicates where we are.
   * ?? -> xa ->>> ya -> yb ->>> xb
   *
   * todo: would it be possible for stepping into and out of be handled by the RunFlow itself?
   * todo: Does this push cursor into an out-of-sync state? --- yaa
   *       it does: b/c we could step into, but then never have an interaction for that step
   *       aka: should `stepInto()` + `stepOut()` handle `navigateTo()` ? The tricky bit is then we need to go ahead
   *       and re-discover the block attached to block interaction on the cursor */
  stepInto(runTreeBlock: IBlock, ctx: IContext): IBlock | null {
    if (runTreeBlock.type !== 'Core\\RunFlow') {
      throw new Error('Unable to step into a non-Core\\RunFlow block type')
    }

    const lastInteraction = last(ctx.interactions)
    if (!lastInteraction) {
      throw new Error('Unable to step into Core\\RunFlow that hasn\'t yet been started')
    }

    ctx.nestedFlowBlockInteractionStack.push(lastInteraction.uuid)

    return first(getActiveFlowFrom(ctx).blocks) || null
  }

  /**
   * Stepping out is the act of moving back into parent tree.
   * However, we can't move up into parent tree without a cursor indicating we've moved.
   * `stepOut()` needs to be the things that discovers xb from xa (via nfbistack)
   * Then generating a cursor that indicates where we are.
   * ?? -> xa ->>> ya -> yb ->>> xb
   *
   * Does this push cursor into an out-of-sync state?
   * Not when stepping out, because when stepping out, we're connecting previous RunFlow output
   * to next block; when stepping IN, we need an explicit navigation to inject RunFlow in between
   * the two Flows. */
  stepOut(ctx: IContext): IBlock | null {
    const
        lastInteractionId = ctx.nestedFlowBlockInteractionStack.pop(),
        interaction = findInteractionWith(lastInteractionId || '', ctx)

    // todo: how does selectedExitId get set for last/this block(s) ???

    return this.findNextBlockFrom(interaction, ctx)
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
