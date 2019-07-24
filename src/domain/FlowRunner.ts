import IBlock from "../flow-spec/IBlock"
import IContext, {
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
 *       - step into run-flow-block
 *       - step out of run-flow-block
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
    this.context.session.originFlowId = this.context.firstFlowId
    this.context.session.originBlockInteractionId = null

    return this.runUntilInputRequiredFrom(this.context)
  }

  resume() {
    return this.resumeFrom(this.context)
  }

  runUntilInputRequiredFrom(ctx: IContext): RichCursorInputRequiredType | null {
    let block = this.findNextBlockOnActiveFlowFor(ctx)

    // when next block available and prompt returned
    // when multiple blocks available and prompt returned
    while(block) {
      const [interaction, prompt] = this.startOneBlock(block)
      // append interaction for block to @interactions
      ctx.interactions.push(interaction)
      // update cursor to reflect new interaction's id and prompt (when prompt provided, null when absent)
      ctx.cursor = [interaction.uuid, prompt]

      // return cursor for interaction when prompt provided
      if (prompt) {
        return [interaction, prompt]
      }

      if (block.type === 'Core\\RunFlowBlock') {
        this.stepInto(block, ctx)
      }

      block = this.findAndNavigateToNextBlockOn(ctx)
      if (!block) {
        this.stepOut() // todo: does this push cursor into an out-of-sync state?
        // block = this.findAndNavigateToNextBlockOn(ctx)
        // this.resumeFrom(ctx)
      }
    }

    delete ctx.cursor
    return null
  }

  findAndNavigateToNextBlockOn(ctx: IContext): IBlock | null {

    // todo: remember to also verify cursor.prompt.isSubmitted (set by b-runner.resume())
    // todo: b-runner also sets: {exitAt, hasResponse, value, details, type}
    // ctx.nestedFlowBlockInteractionStack.push/pop()

    // exit will be on the block interaction that's on the current cursor

    // todo: should flow have starting_block_id ?

    // trying to figure out if this should manage block interactions + cursors; I actually think navigateTo() should be in the caller

    // todo trick is: we don't want to generate a new block interaction if we're still stuck on this block (eg. prompt/block interaction are not yet fulfilled.
    //                eg: who manages block interactions list in this sense? it seems deeply coupled with the concept of "where we are" and "where to go from here"
    //                    however, if we're solely relying upon cursor to figure out what's current, then block_interactions list seems a bit of a side project






    return null
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

  getCursorInteractionFrom({interactions, cursor}: IContext): IBlockInteraction | null {
    return cursor
        ? find(interactions, {uuid: cursor[0]}) || null
        : null
  }

  findBlockOnActiveFlowWith(uuid: string, ctx: IContext): IBlock | null {
    const flow = this.getActiveFlowFrom(ctx)
    return flow
        ? find(flow.blocks, {uuid}) || null
        : null
  }

  resumeFrom(ctx: IContext) { // todo: this must be an anti-pattern --- why am I needing to repeat these same guards all over the place? shouldn't I be able to orchestrate in such a way that it's guarded on the way in and then we can forget about it?
                              //       can we add a type for: (a) ctx that HAS a cursor + (b) something lke: ctx.interactions must have uuid of cursor's interaction uuid?
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

  startOneBlock(block: IBlock): RichCursorType {
    const
        runner = this.createBlockRunnerFor(block),
        interaction = this.createBlockInteractionFor(block, originBlockInteractionId),
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
    // todo: how do we define capabilities + available runners? likely provide a FactoryStore<{(block: IBlock) => IBlockRunner}>
    // const factory = this.runners.get(block.type)
    // return factory(block)
    return new MessageBlockRunner(block)
  }

  createBlockInteractionFor({uuid: blockId}: IBlock, originBlockInteractionId=null): IBlockInteraction {
    return {
      uuid: uuid.v4(),
      blockId,
      entryAt: new Date,
      exitAt: null,
      hasResponse: false,
      value: null,
      details: {selectedExitId: null},
      type: null, // (?) -- awaiting response from @george + @mark on this

      originFlowId: null, // this.getActiveFlowIdFrom(ctx)
      originBlockInteractionId: null // I don't know where this comes from; we could forward it from last interaction?
    }
  }

  navigateTo(block: IBlock) {
    // todo: what does this do other than start + create + cursor + checks ?
  }

  stepInto(runTreeBlock: IBlock, ctx: IContext) {
    if (runTreeBlock.type !== 'Core\\RunFlow') {
      return
    }

    const {flow_id} = runTreeBlock.config as RunFlowConfig,
        lastInteraction = last(ctx.interactions)

    if (!lastInteraction) {
      throw new Error('Unable to step into Core\\RunFlow that hasn\'t yet been started')
    }

    ctx.nestedFlowBlockInteractionStack.push(lastInteraction.uuid)
    ctx.session.originBlockInteractionId =
    ctx.session.originFlowId =


    // todo: remove flowId from IBlockInteraction
  }

  stepOut(ctx: IContext) {
    const blockInteractionId = ctx.nestedFlowBlockInteractionStack.pop()
    return blockInteractionId
  }

  getActiveFlowIdFrom({firstFlowId, nestedFlowBlockInteractionStack}: IContext): string {
    return nestedFlowBlockInteractionStack.length
        ? last(nestedFlowBlockInteractionStack) || firstFlowId
        : firstFlowId
  }

  getActiveFlowFrom(ctx: IContext): IFlow | null {
    const uuid = this.getActiveFlowIdFrom(ctx)
    return find(ctx.flows, {uuid}) || null
  }
}
