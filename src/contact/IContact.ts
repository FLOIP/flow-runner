/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IContactProperty} from '../index'

export interface IContact {
  id: IContactProperty | ((...args: string[]) => IContactProperty | undefined) | string | undefined

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: IContactProperty | ((...args: string[]) => IContactProperty | undefined) | string | undefined

  setProperty: (name: string, value?: string) => IContactProperty
  getProperty: (name: string) => IContactProperty | undefined
}
