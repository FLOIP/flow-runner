/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {NonBreakingUpdateOperation} from 'sp2'
import {IBlock, IBlockRunner, IContext, IRichCursor, IRichCursorInputRequired} from '../index'

export type TBlockRunnerFactory = {(block: IBlock, ctx: IContext): IBlockRunner}

export type IBlockRunnerFactoryStore = Map<string, TBlockRunnerFactory>

export interface IFlowRunner {
  context: IContext
  runnerFactoryStore: IBlockRunnerFactoryStore

  // new (context: IContext): IFlowRunner

  initialize(): Promise<IRichCursor | undefined>

  run(): Promise<IRichCursorInputRequired | undefined>

  applyReversibleDataOperation(forward: NonBreakingUpdateOperation, reverse: NonBreakingUpdateOperation, context: IContext): void
}
