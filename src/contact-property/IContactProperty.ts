/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

export interface IContactProperty {
  contactPropertyFieldName: string
  createdAt: string
  updatedAt: string
  deletedAt: string | undefined
  __value__: string | undefined
}

export default IContactProperty
