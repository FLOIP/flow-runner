/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IContactProperty, createFormattedDate} from '../index'

export class ContactProperty implements IContactProperty {
  deletedAt: string | undefined
  createdAt: string = createFormattedDate()
  updatedAt: string = createFormattedDate()
  __value__!: string

  constructor() {}

  get contactPropertyFieldName(): string {
    return this.contactPropertyFieldName
  }

  set contactPropertyFieldName(contactPropertyFieldName: string) {
    this.contactPropertyFieldName = contactPropertyFieldName
    this.updatedAt = createFormattedDate()
  }

  get value(): string {
    return this.__value__
  }

  set value(value: string) {
    this.__value__ = value
    this.updatedAt = createFormattedDate()
  }
}

export default ContactProperty
