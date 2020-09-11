/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IBlock, IBlockExit, IBlockInteraction, IContext, IPromptConfig, IRichCursor} from '../index'

/**
 * Interface for running a new block type.
 *
 * There are two methods to implement this contract:
 *
 * - {@link initialize} — Converts an interaction and its block property into either a prompt configuration or
 *   `undefined`.
 *       - {@link IPromptConfig} is the guts of a prompt and has all of the pieces needed to interact with an
 *         {@link IContact}. If a block type has no need to halt flow execution to interact with the {@link IContact},
 *         then simply returning without any configuration is all we need.
 *       - Some applications will provide the ability to step back through interaction history to a previous point in
 *         time. In this case, we utilize the interaction reference in order to initialize a prompt with the previous
 *         value already pre-populated onto it. This is best practice, and we'll see an example of it below.
 * - {@link run} — Takes the current point in our interaction history and performs some local logic to decide how the
 *   Flow should continue by returning the desired {@link IBlockExit} to be used. In some cases we always resolve to a
 *   single exit, but many cases have more complexity around this part of the puzzle.
 */
export interface IBlockRunner {
  block: IBlock
  context: IContext

  /**
   * Converts an interaction and its block property into either a prompt configuration or `undefined`.
   * @param interaction
   */
  initialize(interaction: IBlockInteraction): Promise<IPromptConfig<any> | undefined>

  /**
   * Takes the current point in our interaction history and performs some local logic to decide how the Flow should
   * continue by returning the desired {@link IBlockExit} to be used. In some cases we always resolve to a single exit,
   * but many cases have more complexity around this part of the puzzle.
   * @param cursor
   */
  run(cursor: IRichCursor): Promise<IBlockExit>
}
