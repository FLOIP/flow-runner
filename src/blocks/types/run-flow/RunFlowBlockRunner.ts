/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IBlock, IBlockExit, IBlockRunner, IContext, IRunFlowBlockConfig} from '../../../index'

/**
 * Block runner for `Core\RunFlow` - This block starts and runs another {@link IFlow}, and returns execution to the
 * current {@link IFlow} when finished.
 *
 * Entry:
 * On entry to this block, control proceeds into the other Flow given by flow_id. The Context for the outer flow is
 * saved and stored within the new inner Flow's Context under the parentFlowContext key.
 *
 * Exit:
 * Multiple levels of nested Flows shall be supported. When an inner Flow terminates, this block resumes execution in
 * the outer Flow. The Context for the inner flow is saved and stored under the childFlowContext key, and flow proceeds
 * through the next block. If an exception exit is triggered within an inner flow causing the inner flow to terminate,
 * flow proceeds through the error exit.
 */
export class RunFlowBlockRunner implements IBlockRunner {
  constructor(public block: IBlock & {config: IRunFlowBlockConfig}, public context: IContext) {}

  async initialize(): Promise<undefined> {
    return undefined
  }

  async run(): Promise<IBlockExit> {
    return this.block.exits[0]
  }
}
