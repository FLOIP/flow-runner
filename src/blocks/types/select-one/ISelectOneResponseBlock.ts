/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IBlockWithTestExits, ISelectOneResponseBlockConfig} from '../../../index'

// todo: currently we don't perform any other behaviour than test evaluation on SelectOne
export interface ISelectOneResponseBlock extends IBlockWithTestExits {
  config: ISelectOneResponseBlockConfig
}
