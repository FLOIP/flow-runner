/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IBlock, INumericBlockConfig} from '../../../index'

export interface INumericResponseBlock extends IBlock {
  config: INumericBlockConfig
}
