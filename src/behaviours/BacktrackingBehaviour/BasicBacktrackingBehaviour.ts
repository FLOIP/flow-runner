/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

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
} from '../../index'

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
  constructor(public context: IContext, public navigator: IFlowNavigator, public promptBuilder: IPromptBuilder) {}

  rebuildIndex(): void {
    // do nothing for now
  }

  async seek(steps = 0, context: IContext = this.context): Promise<IRichCursorInputRequired> {
    const {interaction: prevIntx, prompt: virtualPrompt}: IRichCursorInputRequired = await this.peek(steps, context)
    // then generate a cursor from desired interaction && set cursor on context
    const cursor: IRichCursorInputRequired = (await this.jumpTo(prevIntx, context)) as IRichCursorInputRequired

    // pre-populate previous value onto prompt for new interaction
    cursor.prompt.value = virtualPrompt.value

    return cursor
  }

  async jumpTo(intx: IBlockInteraction, context: IContext = this.context): Promise<IRichCursor> {
    // jump context.interactions back in time
    const discarded = context.interactions.splice(
      // truncate intx list to pull us back in time; include provided intx
      findLastIndex(context.interactions, intx),
      context.interactions.length
    )

    // step out of nested flows that we've truncated
    // todo: migrate to also use applyReversibleDataOperation()
    forEachRight(discarded, intx =>
      intx.uuid === last(context.nestedFlowBlockInteractionIdStack) ? context.nestedFlowBlockInteractionIdStack.pop() : null
    )

    // can only reverse from the end, so we only compare the last.
    forEachRight(discarded, ({uuid}) => {
      while (last(context.reversibleOperations)?.interactionId === uuid) {
        FlowRunner.prototype.reverseLastDataOperation(context)
      }
    })

    return this.navigator.navigateTo(findBlockOnActiveFlowWith(intx.blockId, context), context)
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
    const block = findBlockWith(intx.blockId, findFlowWith(intx.flowId, context))

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
    return interaction
  }

  postInteractionComplete(_interaction: IBlockInteraction, _context: IContext): void {
    // do nothing
  }
}
