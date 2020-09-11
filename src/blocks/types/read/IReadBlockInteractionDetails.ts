/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IBlockInteractionDetails} from '../../../index'

export interface IReadBlockInteractionDetails extends IBlockInteractionDetails {
  readError: IReadError
}

export interface IReadError {
  message: string
}
