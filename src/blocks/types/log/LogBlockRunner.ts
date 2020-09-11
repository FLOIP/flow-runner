/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {evaluateToString, IBlockExit, IBlockRunner, IContext, ILogBlock, createFormattedDate} from '../../../index'

/**
 * Block runner for `Core\Log` - Appends a low-level message to {@link IContext.logs}.
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
    this.context.logs[createFormattedDate()] = evaluateToString(this.block.config.message, this.context)

    // todo: should we also write this as the value of the block interaction like the output block?

    return this.block.exits[0]
  }
}
