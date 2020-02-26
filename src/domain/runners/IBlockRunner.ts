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

import IBlock from '../../flow-spec/IBlock'
import IBlockInteraction from '../../flow-spec/IBlockInteraction'
import IBlockExit from '../../flow-spec/IBlockExit'
import {IPromptConfig, IRichCursor} from '../..'
import IContext from '../../flow-spec/IContext'

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
  block: IBlock,
  context: IContext,

  /**
   * Converts an interaction and its block property into either a prompt configuration or `undefined`.
   * @param interaction
   */
  initialize(interaction: IBlockInteraction): IPromptConfig<any> | undefined,

  /**
   * Takes the current point in our interaction history and performs some local logic to decide how the Flow should
   * continue by returning the desired {@link IBlockExit} to be used. In some cases we always resolve to a single exit,
   * but many cases have more complexity around this part of the puzzle.
   * @param cursor
   */
  run(cursor: IRichCursor): Promise<IBlockExit>,
}

export default IBlockRunner
