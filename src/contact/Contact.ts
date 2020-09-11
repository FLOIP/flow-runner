/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IContact, IContactProperty, createFormattedDate} from '../index'

export class Contact implements IContact {
  [key: string]: IContactProperty | ((...args: any[]) => IContactProperty | undefined) | string | undefined

  id!: string

  constructor() {}

  public setProperty(name: string, value: any): IContactProperty {
    const prop: IContactProperty = {
      __value__: value,
      contactPropertyFieldName: name,
      createdAt: createFormattedDate(),
      updatedAt: createFormattedDate(),
      deletedAt: undefined,
    }
    this[name] = prop
    return prop
  }

  public getProperty(name: string): IContactProperty | undefined {
    if (this[name] == null) {
      return undefined
    }
    return this[name] as IContactProperty
  }
}

export default Contact
