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

import {evaluateToString, IBlockExit, IBlockRunner, IContext, IOutputBlock, IRichCursor, setContactProperty} from '../..'
import { createEvalContextFrom } from '../../'

/**
 * Block runner for `Core.Output` - This block provides a connection to the
 * [Flow Results specification](https://github.com/FLOIP/flow-results/blob/master/specification.md), by storing a named
 * Output variable.
 *
 * Not all block interactions and low-level logs are important to users; most users are concerned with a subset of
 * results that have specific meaning -- the "Flow Results". (See Flow Results specification.) Any block type, as part
 * of its specified runtime behaviour, may write to the Flow Results. The Output Block is a low-level block that does
 * just simply one thing: write a named variable corresponding to the name of the block to the Flow Results, determined
 * by the value expression.
 */
export class OutputBlockRunner implements IBlockRunner {
  constructor(public block: IOutputBlock, public context: IContext) {}

  async initialize(): Promise<undefined> {
    return
  }

  async run(cursor: IRichCursor): Promise<IBlockExit> {
    cursor.interaction.value = evaluateToString(this.block.config.value, createEvalContextFrom(this.context))
    cursor.interaction.has_response = true
    setContactProperty(this.block, this.context)
    return this.block.exits[0]
  }
}
