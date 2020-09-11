/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {evaluateToString, IBlockExit, IBlockRunner, IContext, IPrintBlock} from '../../../index'

/**
 * Block runner for `ConsoleIO\Print` - Prints a message to standard output, by evaluating an expression.
 */
export class PrintBlockRunner implements IBlockRunner {
  constructor(public block: IPrintBlock, public context: IContext, public console: Console = console) {}

  async initialize(): Promise<undefined> {
    return
  }

  async run(): Promise<IBlockExit> {
    this.console.log(this.block.type, evaluateToString(this.block.config.message, this.context))

    // todo: should we also write this as the value of the block interaction like the output block?
    return this.block.exits[0]
  }
}
