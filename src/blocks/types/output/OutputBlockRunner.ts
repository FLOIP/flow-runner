/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {evaluateToString, IBlockExit, IBlockRunner, IContext, IOutputBlock, IRichCursor} from '../../../index'

/**
 * Block runner for `Core\Output` - This block provides a connection to the
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
    // todo: should we be setting hasRepsonse to `true` here?
    cursor.interaction.value = evaluateToString(this.block.config.value, this.context)
    return this.block.exits[0]
  }
}
