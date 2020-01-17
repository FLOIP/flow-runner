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
  findFlowWith, TRichCursorInputRequired,
  TRichCursor,
} from '../../../flow-spec/IContext'
import ValidationException from '../../exceptions/ValidationException'
import FlowRunner, {IFlowNavigator, IPromptBuilder, NON_INTERACTIVE_BLOCK_TYPES} from '../../FlowRunner'
import {findBlockWith} from '../../..'


export interface IBackTrackingBehaviour extends IBehaviour {
  rebuildIndex(): void,
  // generates new prompt from new interaction + resets state to what was `interaction`'s moment
  // todo: this should likely take in steps rather than interaction itself
  jumpTo(interaction: IBlockInteraction): TRichCursor,
  // regenerates prompt from previous interaction
  peek(steps?: number): TRichCursor,
  // regenerates prompt + interaction in place of previous interaction; updates context.cursor
  seek(steps?: number): TRichCursor,
}

export class BasicBacktrackingBehaviour implements IBackTrackingBehaviour {
  constructor(
    public context: IContext,
    public navigator: IFlowNavigator,
    public promptBuilder: IPromptBuilder) {}

  rebuildIndex(): void {
    // do nothing for now
  }

  seek(steps=0, context: IContext = this.context): TRichCursorInputRequired {
    const [prevIntx, virtualPrompt]: TRichCursorInputRequired = this.peek(steps, context)
    // then generate a cursor from desired interaction && set cursor on context
    const cursor: TRichCursorInputRequired = this.jumpTo(prevIntx, context) as TRichCursorInputRequired

    // pre-populate previous value onto prompt for new interaction
    cursor[1].value = virtualPrompt.value

    return cursor
  }

  jumpTo(intx: IBlockInteraction, context: IContext = this.context): TRichCursor {
    // jump context.interactions back in time
    const discarded = context.interactions.splice( // truncate intx list to pull us back in time; include provided intx
      findLastIndex(context.interactions, intx),
      context.interactions.length)

    // step out of nested flows that we've truncated
    // todo: migrate to also use applyReversibleDataOperation()
    forEachRight(discarded, intx => intx.uuid === last(context.nestedFlowBlockInteractionIdStack)
        ? context.nestedFlowBlockInteractionIdStack.pop()
        : null)

    // can only reverse from the end, so we only compare the last.
    forEachRight(discarded, ({uuid}) => {
      while (last(context.reversibleOperations)?.interactionId === uuid) {
        FlowRunner.prototype.reverseLastDataOperation(context)
      }
    })

    return this.navigator.navigateTo(
      findBlockOnActiveFlowWith(intx.blockId, context),
      context)
  }

  peek(steps = 0, context: IContext = this.context): TRichCursorInputRequired {
    let _steps = steps + 1 // setup for while-loop
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

  postInteractionComplete(_interaction: IBlockInteraction, _context: IContext): void {
    // do nothing
  }
}

export default BasicBacktrackingBehaviour