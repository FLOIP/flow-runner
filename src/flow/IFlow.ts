/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IBlock, ILanguage, SupportedMode, ValidationException} from '../index'
import {find} from 'lodash'

export interface IFlow {
  // UUID32
  uuid: string
  orgId: string
  name: string
  label?: string

  // UTC like: 2016-12-25 13:42:05.234598
  lastModified: string
  interactionTimeout: number
  platformMetadata: object

  supportedModes: SupportedMode[]

  // eunm for ISO 639-3 codes
  languages: ILanguage[]
  blocks: IBlock[]

  firstBlockId: string
  exitBlockId?: string
}

export function findBlockWith(uuid: string, {blocks}: IFlow): IBlock {
  const block = find(blocks, {uuid})
  if (block == null) {
    throw new ValidationException('Unable to find block on flow')
  }

  return block
}

export interface IFlowService {
  findBlockWith(uuid: string, flow: IFlow): IBlock
}
