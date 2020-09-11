/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

export interface IBlockInteraction {
  // UUID64
  uuid: string

  // UUID32
  blockId: string

  // UUID32
  flowId: string
  entryAt: string
  exitAt?: string
  hasResponse: boolean
  value?: unknown
  details: IBlockInteractionDetails
  selectedExitId?: string
  type: string

  // UUID64
  originBlockInteractionId?: string

  // UUID64
  originFlowId?: string
}

export interface IBlockInteractionDetails {}
