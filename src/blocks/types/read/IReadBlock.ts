/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IBlock, IReadBlockConfig} from '../../../index'

export interface IReadBlock extends IBlock {
  config: IReadBlockConfig
}
