import IBlock from "../flow-spec/IBlock"
import IContext, {
  IContextInputRequired,
  RichCursorInputRequiredType,
  RichCursorType
} from "../flow-spec/IContext"
import IBlockRunner from "./runners/IBlockRunner"
import IBlockInteraction from "../flow-spec/IBlockInteraction"
import IBlockExit from "../flow-spec/IBlockExit"
import {find, last} from 'lodash'
import uuid from 'uuid'
import MessageBlockRunner from "./runners/MessageBlockRunner";
import IFlow from "../flow-spec/IFlow";
import RunFlowConfig from "../model/block/RunFlowConfig";

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

  start(): RichCursorInputRequiredType | null {
    return this.runUntilInputRequiredFrom(this.context)
  }

  resume() {
    return this.resumeFrom(this.context)
  }

  runUntilInputRequiredFrom(ctx: IContext): RichCursorInputRequiredType | null {
    // todo: convert cursor to an object instead of tuple

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
        block = this.stepInto(block, ctx) // todo: do we need to connect selected exits here?
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
    const
        {cursor} = ctx,
        interaction = this.getCursorInteractionFrom(ctx)

    if (!interaction) {
      throw new Error('Unable to find interaction for cursor')
    }

    return [interaction, cursor[1]]
  }

  /**
   * todo: this must be an anti-pattern --- why am I needing to repeat these same guards all over the place? shouldn't I be able to orchestrate in such a way that it's guarded on the way in and then we can forget about it?
   *       can we add a type for: (a) ctx that HAS a cursor + (b) something lke: ctx.interactions must have uuid of cursor's interaction uuid?
   */
  resumeFrom(ctx: IContext) {
    if (!ctx.cursor) {
      throw new Error('Unable to resume from unstarted state.')
    }

    const interaction = this.getCursorInteractionFrom(ctx)
    if (!interaction) {
      throw new Error('Unable to find interaction for cursor')
    }

    const block = this.findBlockOnActiveFlowWith(interaction.blockId, ctx)
    if (!block) {
      throw new Error('Unable to find block for interaction')
    }

    /*const exit = */this.resumeOneBlock(block, ctx)
    return this.runUntilInputRequiredFrom(ctx)
  }

  startOneBlock(block: IBlock, flowId: string, originFlowId: string | null, originBlockInteractionId: string | null): RichCursorType {
    const
        runner = this.createBlockRunnerFor(block),
        interaction = this.createBlockInteractionFor(block, flowId, originFlowId, originBlockInteractionId),
        prompt = runner.start(interaction)

    return [interaction, prompt]
  }

  resumeOneBlock(block: IBlock, ctx: IContext): IBlockExit {
    if (!ctx.cursor) {
      throw new Error('Unable to resume from unstarted state.')
    }

    const interaction = this.getCursorInteractionFrom(ctx)
    if (!interaction) {
      throw new Error('Unable to find interaction for cursor')
    }

    return this.createBlockRunnerFor(block)
        .resume([interaction, ctx.cursor[1]]) // todo: resume() needs to set "prompt.isSubmitted"
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
      flowId: string, originFlowId: string | null = null,
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
        flowId = this.getActiveFlowIdFrom(ctx),
        originInteractionId = last(ctx.nestedFlowBlockInteractionStack) || null,
        originInteraction = originInteractionId
            ? this.findInteractionWith(originInteractionId, ctx)
            : null

    if (originInteractionId && !originInteraction) {
      throw new Error('Unable to find interaction for nested flow')
    }

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
   *       and re-discover the block attached to block interaction on the cursor
   */
  stepInto(runTreeBlock: IBlock, ctx: IContext) {
    if (runTreeBlock.type !== 'Core\\RunFlow') {
      throw new Error('Unable to step into a non-Core\\RunFlow block type')
    }

    const lastInteraction = last(ctx.interactions)
    if (!lastInteraction) {
      throw new Error('Unable to step into Core\\RunFlow that hasn\'t yet been started')
    }

    ctx.nestedFlowBlockInteractionStack.push(lastInteraction.uuid)

    return this.findFirstBlockOnActiveFlowFor(ctx)
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
   * the two Flows.
   */
  stepOut(ctx: IContext): IBlock | null {
    const
        lastInteractionId = ctx.nestedFlowBlockInteractionStack.pop(),
        interaction = this.findInteractionWith(lastInteractionId || '', ctx)

    if (!interaction) {
      throw new Error('Unable to find interaction on context')
    }

    // todo: how does selectedExitId get set for last/this block(s) ???

    return this.findNextBlockFrom(interaction, ctx)
  }

  findNextBlockOnActiveFlowFor(ctx: IContext): IBlock | null {//cursor: RichCursorType | null, flow: IFlow): IBlock | null {
    const flow = this.getActiveFlowFrom(ctx)
    if (!flow) {
      throw new Error('Unable to find active flow on context')
    }

    const {cursor} = ctx
    if (!cursor) {
      return flow.blocks[0]
    }

    const interaction = this.getCursorInteractionFrom(ctx)
    if (!interaction) {
      throw new Error(`Unable to find interaction for cursor: ${JSON.stringify({cursor: ctx.cursor, interactions: ctx.interactions}, null, 2)}`)
    }

    return this.findNextBlockFrom(interaction, ctx)
  }

  findNextBlockFrom(interaction: IBlockInteraction, ctx: IContext) {
    const block = this.findBlockOnActiveFlowWith(interaction.blockId, ctx)
    if (!block) {
      throw new Error('Unable to find block on active flow')
    }

    if (!interaction.details.selectedExitId) {
      throw new Error('Unable to navigate past incomplete interaction; did you forget to call runner.resume()?') // eg. prompt.isFulfilled() === false || !called block.resume()
    }

    const exit = find(block.exits, {uuid: interaction.details.selectedExitId})
    if (!exit) {
      throw new Error('Unable to find block exit for active interaction')
    }

    return this.findBlockOnActiveFlowWith(exit.destination_block, ctx) || null
  }

  findFirstBlockOnActiveFlowFor(ctx: IContext) {
    const flow = this.getActiveFlowFrom(ctx)
    if (!flow) {
      throw new Error('Unable to find active flow on context')
    }

    return flow.blocks[0]
  }

  findInteractionWith(uuid: string, {interactions}: IContext): IBlockInteraction | null {
    return find(interactions, {uuid}) || null
  }

  getCursorInteractionFrom(ctx: IContext): IBlockInteraction | null {
    const {cursor} = ctx
    return cursor
        ? this.findInteractionWith(cursor[0], ctx)
        : null
  }

  findBlockOnActiveFlowWith(uuid: string, ctx: IContext): IBlock | null {
    const flow = this.getActiveFlowFrom(ctx)
    return flow
        ? find(flow.blocks, {uuid}) || null
        : null
  }

  findNestedFlowIdFor(interaction: IBlockInteraction, ctx: IContext) {
    const flow = find(ctx.flows, {uuid: interaction.flowId}) || null
    if (!flow) {
      throw new Error('Unable to find active flow on context')
    }

    const runFlowBlock = find(flow.blocks, {uuid: interaction.flowId}) || null
    if (!runFlowBlock) {
      throw new Error('Unable to find run flow block on parent flow')
    }

    return (runFlowBlock.config as RunFlowConfig).flow_id
  }

  getActiveFlowIdFrom(ctx: IContext): string {
    const {firstFlowId, nestedFlowBlockInteractionStack} = ctx

    if (!nestedFlowBlockInteractionStack.length) {
      return firstFlowId
    }

    const interaction = this.findInteractionWith(last(nestedFlowBlockInteractionStack) || '', ctx)
    if (!interaction) {
      throw new Error('Unable to find interaction for nested flow')
    }

    return this.findNestedFlowIdFor(interaction, ctx)
  }

  getActiveFlowFrom(ctx: IContext): IFlow | null {
    const uuid = this.getActiveFlowIdFrom(ctx)
    return find(ctx.flows, {uuid}) || null
  }
}
