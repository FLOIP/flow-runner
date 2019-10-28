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
  findFlowWith,
  RichCursorType,
} from '../../../flow-spec/IContext'
import ValidationException from '../../exceptions/ValidationException'
import {IFlowNavigator, IPromptBuilder, NON_INTERACTIVE_BLOCK_TYPES} from '../../FlowRunner'
import IPrompt, {IBasePromptConfig, IPromptConfig} from '../../prompt/IPrompt'
import {findBlockWith} from '../../..'


export interface IBackTrackingBehaviour extends IBehaviour {
  rebuildIndex(): void
  // generates new prompt from new interaction + resets state to what was `interaction`'s moment
  jumpTo(interaction: IBlockInteraction, context: IContext): RichCursorType // todo: this should likely take in steps rather than interaction itself
  // regenerates prompt from previous interaction
  peek(steps?: number): IPrompt<IPromptConfig<any> & IBasePromptConfig>
}

export default class BacktrackingBehaviour implements IBackTrackingBehaviour {
  constructor(
    public context: IContext,
    public navigator: IFlowNavigator,
    public promptBuilder: IPromptBuilder) {}

  rebuildIndex() {}

  jumpTo(interaction: IBlockInteraction, context: IContext): RichCursorType {
    // jump context.interactions back in time
    const discarded = context.interactions.splice( // truncate interactions list to pull us back in time; including provided intx
      findLastIndex(context.interactions, interaction),
      context.interactions.length)

    // step out of nested flows that we've truncated
    forEachRight(discarded, intx => intx.uuid === last(context.nestedFlowBlockInteractionIdStack)
        ? context.nestedFlowBlockInteractionIdStack.pop()
        : null)

    return this.navigator.navigateTo(
      findBlockOnActiveFlowWith(interaction.blockId, this.context),
      this.context)
  }

  peek(steps = 1): IPrompt<IPromptConfig<any> & IBasePromptConfig> {
    let _steps = steps
    const intx = findLast(this.context.interactions, ({type}) =>
      !includes(NON_INTERACTIVE_BLOCK_TYPES, type) && --_steps === 0)

    if (intx == null || _steps > 0) {
      throw new ValidationException(`Unable to backtrack to an interaction that far back ${JSON.stringify({steps})}`)
    }

    const block = findBlockWith(
      intx.blockId,
      findFlowWith(intx.flowId, this.context))

    const prompt = this.promptBuilder.buildPromptFor(block, intx)
    if (prompt == null) {
      throw new ValidationException(`Unable to build a prompt for ${JSON.stringify({
        context: this.context.id,
        intx,
        block
      })}`)
    }

    return Object.assign(prompt, {value: intx.value})
  }

  postInteractionCreate(interaction: IBlockInteraction, _context: IContext): IBlockInteraction {
    return interaction
  }

  postInteractionComplete(_interaction: IBlockInteraction, _context: IContext): void {}
}
