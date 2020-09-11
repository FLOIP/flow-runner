/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IBlockInteraction, IContext, IFlowNavigator, IPromptBuilder} from '../index'

export interface IBehaviourConstructor {
  new (context: IContext, navigator: IFlowNavigator, promptBuilder: IPromptBuilder): IBehaviour
}

/**
 * Inteface for {@link FlowRunner} extensibility; provides hooks into core runner behaviour.
 */
export interface IBehaviour {
  context: IContext
  navigator: IFlowNavigator
  promptBuilder: IPromptBuilder

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
  postInteractionCreate(interaction: IBlockInteraction, context: IContext): IBlockInteraction

  /**
   * {@link FlowRunner} hook:
   * - invoked immediately after (a) the {@link IBlockRunner} has been run (b) the {@link IBlockExit} has been selected
   *   (c) the associated {@link IPrompt} is marked as {@link IBasePromptConfig.isSubmitted}.
   * - invoked immediately before the next block is to be discovered.
   * @param interaction
   * @param context
   */
  postInteractionComplete(interaction: IBlockInteraction, context: IContext): void
}
