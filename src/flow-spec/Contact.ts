/**
 * Flow Interoperability Project (flowinterop.org)
 * Flow Runner
 * Copyright (c) 2019, 2020 Viamo Inc.
 * Authored by: Brett Zabos (brett.zabos@viamo.io)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/

import {IContact, IContactProperty, IContactPropertyType, createFormattedDate, IContactGroup, IGroup, ContactGroup} from '..'

export class Contact implements IContact {
  [key: string]: IContactPropertyType

  id!: string

  groups: IContactGroup[]

  constructor() {
    this.groups = []
  }

  public setProperty(name: string, value: any): IContactProperty {
    const prop: IContactProperty = {
      __value__: value,
      value: value,
      contact_property_field_name: name,
      created_at: createFormattedDate(),
      updated_at: createFormattedDate(),
      deleted_at: undefined,
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

  public addGroup(newGroup: IGroup): void {
    const existingGroup = this.groups.find(group => group.group_key === newGroup.group_key)
    if (existingGroup) {
      existingGroup.updated_at = createFormattedDate()
      // make sure this group isn't marked as deleted
      existingGroup.deleted_at = undefined
    } else {
      this.groups.push(new ContactGroup(newGroup))
    }
  }

  public delGroup(toRemove: IGroup): void {
    const group = this.groups.find(group => group.group_key === toRemove.group_key)
    if (group) {
      const now = createFormattedDate()
      group.deleted_at = now
      group.updated_at = now
    }
  }
}

export default Contact
