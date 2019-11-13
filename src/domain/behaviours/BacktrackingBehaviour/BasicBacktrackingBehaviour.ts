import {
  findLastIndex,
  findLast,
  forEachRight,
  includes,
  last,
} from 'lodash'
import IBehaviour from '../IBehaviour'
import IBlockInteraction from '../../../flow-spec/IBlockInteraction'
import IContext, {
  findBlockOnActiveFlowWith,
  findFlowWith, RichCursorInputRequiredType,
  RichCursorType,
} from '../../../flow-spec/IContext'
import ValidationException from '../../exceptions/ValidationException'
import {IFlowNavigator, IPromptBuilder, NON_INTERACTIVE_BLOCK_TYPES} from '../../FlowRunner'
import {findBlockWith} from '../../..'


export interface IBackTrackingBehaviour extends IBehaviour {
  rebuildIndex(): void
  // generates new prompt from new interaction + resets state to what was `interaction`'s moment
  jumpTo(interaction: IBlockInteraction): RichCursorType // todo: this should likely take in steps rather than interaction itself
  // regenerates prompt from previous interaction
  peek(steps?: number): RichCursorType
  // regenerates prompt + interaction in place of previous interaction; updates context.cursor
  seek(steps?: number): RichCursorType
}

export default class  BasicBacktrackingBehaviour implements IBackTrackingBehaviour {
  constructor(
    public context: IContext,
    public navigator: IFlowNavigator,
    public promptBuilder: IPromptBuilder) {}

  rebuildIndex() {}

  seek(steps=0, context: IContext = this.context): RichCursorInputRequiredType {
    const [prevIntx, virtualPrompt]: RichCursorInputRequiredType = this.peek(steps, context)
    // then generate a cursor from desired interaction && set cursor on context
    const cursor: RichCursorInputRequiredType = this.jumpTo(prevIntx, context) as RichCursorInputRequiredType

    // pre-populate previous value onto prompt for new interaction
    cursor[1].value = virtualPrompt!.value

    return cursor
  }

  jumpTo(intx: IBlockInteraction, context: IContext = this.context): RichCursorType {
    // jump context.interactions back in time
    const discarded = context.interactions.splice( // truncate interactions list to pull us back in time; including provided intx
      findLastIndex(context.interactions, intx),
      context.interactions.length)

    // step out of nested flows that we've truncated
    forEachRight(discarded, intx => intx.uuid === last(context.nestedFlowBlockInteractionIdStack)
        ? context.nestedFlowBlockInteractionIdStack.pop()
        : null)

    return this.navigator.navigateTo(
      findBlockOnActiveFlowWith(intx.blockId, context),
      context)
  }

  peek(steps = 1, context: IContext = this.context): RichCursorInputRequiredType {
    let _steps = steps
    const intx = findLast(context.interactions, ({type}) =>
      !includes(NON_INTERACTIVE_BLOCK_TYPES, type) && --_steps === 0)

    if (intx == null || _steps > 0) {
      throw new ValidationException(`Unable to backtrack to an interaction that far back ${JSON.stringify({steps})}`)
    }

    const block = findBlockWith(
      intx.blockId,
      findFlowWith(intx.flowId, context))

    const prompt = this.promptBuilder.buildPromptFor(block, intx)
    if (prompt == null) {
      throw new ValidationException(`Unable to build a prompt for ${JSON.stringify({
        context: context.id,
        intx,
        block
      })}`)
    }

    return [intx, Object.assign(
      prompt,
      {value: intx.value})]
  }

  postInteractionCreate(interaction: IBlockInteraction, _context: IContext): IBlockInteraction {
    return interaction
  }

  postInteractionComplete(_interaction: IBlockInteraction, _context: IContext): void {}
}
