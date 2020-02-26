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

import IBlockInteraction from '../../flow-spec/IBlockInteraction'
import IContext from '../../flow-spec/IContext'
import {IFlowNavigator, IPromptBuilder} from '../FlowRunner'


export interface IBehaviourConstructor {
  new(
    context: IContext,
    navigator: IFlowNavigator,
    promptBuilder: IPromptBuilder,
  ): IBehaviour,
}

/**
 * Inteface for {@link FlowRunner} extensibility; provides hooks into core runner behaviour.
 */
export interface IBehaviour {
  context: IContext,
  navigator: IFlowNavigator,
  promptBuilder: IPromptBuilder,

  /**
   * {@link FlowRunner} hook:
   * - invoked immediately after any block interaction has begun.
   * - invoked immediately before (a) the {@link IBlockRunner} has been initialized (b) the interaction has been pushed
   *   onto the interaction history stack.
   * - also provides an opportunity to generate a different interaction entity; please be wary of this component of
   *   {@link postInteractionCreate()}, this is a very low-level feature and rarely needed, precautions must be taken.
   * @param interaction
   * @param context
   */
  postInteractionCreate(interaction: IBlockInteraction, context: IContext): IBlockInteraction,

  /**
   * {@link FlowRunner} hook:
   * - invoked immediately after (a) the {@link IBlockRunner} has been run (b) the {@link IBlockExit} has been selected
   *   (c) the associated {@link IPrompt} is marked as {@link IBasePromptConfig.isSubmitted}.
   * - invoked immediately before the next block is to be discovered.
   * @param interaction
   * @param context
   */
  postInteractionComplete(interaction: IBlockInteraction, context: IContext): void,
}

export default IBehaviour
