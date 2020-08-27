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
  findDefaultBlockExitOn,
  findFirstTruthyEvaluatingBlockExitOn,
  IBlockExitTestRequired,
  IBlockRunner,
  ICaseBlock,
  IContext,
} from '../..'

/**
 * Block runner for `Core\Case` - Evaluates a list of expressions, one for each exit, and terminates through the first
 * exit where the corresponding expression evaluates to a "truthy" result.
 *
 * This block will sequentially evaluate the test expressions in each exit (passing over any default exit), in order.
 * If the test expression evaluates to a truthy value using the Context and Expressions framework, flow proceeds through
 * the corresponding exit (and no further exits are evaluated). If no test expressions are found truthy, the flow
 * proceeds through the default exit.
 */
export class CaseBlockRunner implements IBlockRunner {
  constructor(public block: ICaseBlock, public context: IContext) {
  }

  async initialize(): Promise<undefined> {
    return undefined
  }

  async run(): Promise<IBlockExitTestRequired> {
    return findFirstTruthyEvaluatingBlockExitOn(this.block, this.context) ?? (findDefaultBlockExitOn(this.block) as IBlockExitTestRequired)
  }
}
