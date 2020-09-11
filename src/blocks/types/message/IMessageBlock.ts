/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IBlock, IMessageBlockConfig} from '../../../index'

export interface IMessageBlock extends IBlock {
  config: IMessageBlockConfig
}
