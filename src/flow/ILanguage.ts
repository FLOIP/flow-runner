/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

export interface ILanguage {
  id: string
  name: string
  abbreviation: string
  orgId: string
  rightToLeft: boolean
  code?: string
  deletedAt?: string
}
