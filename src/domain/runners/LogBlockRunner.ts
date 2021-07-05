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
  evaluateToString,
  findDefaultBlockExitOrThrow,
  firstTrueOrNullBlockExitOrThrow,
  IBlockExit,
  IBlockRunner,
  IContext,
  ILogBlock,
} from '../..'
import {createFormattedDate} from '../DateFormat'

/**
 * Block runner for `Core.Log` - Appends a low-level message to {@link IContext.logs}.
 *
 * The Context for a Flow shall have a log key, which preserves a mapping of timestamps and log messages for debugging.
 * These logs must be maintained for the duration of the Run, and may be maintained for a longer period. The Log Block
 * provides one way for a Flow to write to this log. On executing this block, the platform will append a key/value pair
 * to the log object within the Context as below, and then proceed to the next block.
 */
export class LogBlockRunner implements IBlockRunner {
  constructor(public block: ILogBlock, public context: IContext) {}

  async initialize(): Promise<undefined> {
    return
  }

  async run(): Promise<IBlockExit> {
    try {
      this.context.logs[createFormattedDate()] = evaluateToString(this.block.config.message, this.context)
      return firstTrueOrNullBlockExitOrThrow(this.block, this.context)
    } catch (e) {
      console.error(e)
      return findDefaultBlockExitOrThrow(this.block)
    }
  }
}
