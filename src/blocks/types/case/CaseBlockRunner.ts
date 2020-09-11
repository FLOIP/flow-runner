/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {
  findDefaultBlockExitOn,
  findFirstTruthyEvaluatingBlockExitOn,
  IBlockExitTestRequired,
  IBlockRunner,
  ICaseBlock,
  IContext,
} from '../../../index'

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
  constructor(public block: ICaseBlock, public context: IContext) {}

  async initialize(): Promise<undefined> {
    return undefined
  }

  async run(): Promise<IBlockExitTestRequired> {
    return findFirstTruthyEvaluatingBlockExitOn(this.block, this.context) ?? (findDefaultBlockExitOn(this.block) as IBlockExitTestRequired)
  }
}
