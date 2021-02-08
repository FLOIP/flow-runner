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

import {find, findLast, findLastIndex, forEachRight, includes, last} from 'lodash'
import {
  findBlockOnActiveFlowWith,
  findBlockWith,
  findFlowWith,
  FlowRunner,
  IBehaviour,
  IBlockInteraction,
  IContext,
  IFlowNavigator,
  IPromptBuilder,
  IRichCursor,
  IRichCursorInputRequired,
  NON_INTERACTIVE_BLOCK_TYPES,
  ValidationException,
} from '../../..'

export enum PeekDirection {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}

/**
 * Interface for time-travel within interaction history.
 */
export interface IBasicBackTrackingBehaviour extends IBehaviour {
  /**
   * Rebuild index over interaction history from scratch.
   */
  rebuildIndex(): void

  /**
   * Generates new prompt from new interaction + resets state to what was {@link IContext.interactions}'s moment
   * @param interaction
   * todo: this should likely take in steps rather than interaction itself */
  jumpTo(interaction: IBlockInteraction): Promise<IRichCursor>

  /**
   * Regenerates prompt from previous interaction
   * @param steps
   */
  peek(steps?: number): Promise<IRichCursor>

  /**
   * Regenerates prompt + interaction in place of previous interaction; updates {@link IContext.cursor}
   * @param steps
   */
  seek(steps?: number): Promise<IRichCursor>
}

/**
 * Basic implementation of time-travel. Solely provides ability to preview what's happened in the past, while any
 * modifications will clear the past's future.
 */
export class BasicBacktrackingBehaviour implements IBasicBackTrackingBehaviour {
  jumpContext?: {
    discardedInteractions: IBlockInteraction[]
    destinationInteraction: IBlockInteraction
  }

  constructor(public context: IContext, public navigator: IFlowNavigator, public promptBuilder: IPromptBuilder) {}

  rebuildIndex(): void {
    // do nothing for now
  }

  async seek(steps = 0, context: IContext = this.context): Promise<IRichCursorInputRequired> {
    const {interaction: prevIntx}: IRichCursorInputRequired = await this.peek(steps, context)
    // then generate a cursor from desired interaction && set cursor on context
    return (await this.jumpTo(prevIntx, context)) as IRichCursorInputRequired
  }

  async jumpTo(destinationInteraction: IBlockInteraction, context: IContext = this.context): Promise<IRichCursor> {
    // jump context.interactions back in time
    const discarded = context.interactions.splice(
      // truncate intx list to pull us back in time; include provided intx
      findLastIndex(context.interactions, destinationInteraction),
      context.interactions.length
    )

    // step out of nested flows that we've truncated
    // todo: migrate to also use applyReversibleDataOperation()
    forEachRight(discarded, intx =>
      intx.uuid === last(context.nested_flow_block_interaction_id_stack) ? context.nested_flow_block_interaction_id_stack.pop() : null
    )

    // can only reverse from the end, so we only compare the last.
    forEachRight(discarded, ({uuid}) => {
      while (last(context.reversible_operations)?.interactionId === uuid) {
        FlowRunner.prototype.reverseLastDataOperation(context)
      }
    })

    const destinationBlock = findBlockOnActiveFlowWith(destinationInteraction.block_id, context)

    this.jumpContext = {discardedInteractions: discarded, destinationInteraction}
    const richCursor = await this.navigator.navigateTo(destinationBlock, context)
    this.jumpContext = undefined

    return richCursor
  }

  _findInteractiveInteractionAt(steps = 0, context: IContext = this.context, direction = PeekDirection.LEFT): IBlockInteraction {
    const _find = {
      [PeekDirection.RIGHT]: find,
      [PeekDirection.LEFT]: findLast,
    }[direction]

    if (_find == null) {
      throw new ValidationException(`Unknown \`direction\` provided to findInteractiveInteractionAt() -
        ${JSON.stringify(direction)}`)
    }

    // setup for while-loop
    let _steps = steps + 1
    const intx = _find(context.interactions, ({type}) => !includes(NON_INTERACTIVE_BLOCK_TYPES, type) && --_steps === 0)

    if (intx == null || _steps > 0) {
      throw new ValidationException(`Unable to backtrack to an interaction that far back ${JSON.stringify({steps})}`)
    }

    return intx
  }

  async peek(steps = 0, context: IContext = this.context, direction = PeekDirection.LEFT): Promise<IRichCursorInputRequired> {
    const intx = this._findInteractiveInteractionAt(steps, context, direction)
    const block = findBlockWith(intx.block_id, findFlowWith(intx.flow_id, context))

    const prompt = await this.promptBuilder.buildPromptFor(block, intx)
    if (prompt == null) {
      throw new ValidationException(
        `Unable to build a prompt for ${JSON.stringify({
          context: context.id,
          intx,
          block,
        })}`
      )
    }

    return {
      interaction: intx,
      prompt: Object.assign(prompt, {value: intx.value}),
    }
  }

  postInteractionCreate(interaction: IBlockInteraction, _context: IContext): IBlockInteraction {
    if (this.jumpContext == null) {
      return interaction
    }

    return Object.assign(interaction, {
      value: this.jumpContext.destinationInteraction.value,
    })
  }

  postInteractionComplete(_interaction: IBlockInteraction, _context: IContext): void {
    // do nothing
  }
}
