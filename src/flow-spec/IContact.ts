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

type ContactPropertyResolver = (...args: string[]) => IContactProperty | undefined
type ContactGroupResolver = (group: IGroup) => void

export type IContactPropertyType = IContactProperty | ContactPropertyResolver | ContactGroupResolver | string | IContactGroup[] | undefined

import {IContactProperty, IContactGroup, IGroup} from '..'

export interface IContact {
  id: IContactPropertyType

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: IContactPropertyType

  groups: IContactGroup[]

  /**
   * Set a property on this contact.
   * The value given will become the value of a new IContactProperty on the
   * contact. That property object should be returned.
   */
  setProperty: (name: string, value?: string) => IContactProperty

  /**
   * Get a property previously defined on this contact.
   * If no such propery exists, this may return undefined, else the
   * IContactProperty will be returned, which contains a string value.
   */
  getProperty: (name: string) => IContactProperty | undefined

  /**
   * Add a group to this contact.
   * The group should be an an existing group within the flow context.
   * The value of the group must be copied into an IContactGroup existing under
   * the `groups` property of the contact.
   */
  addGroup: (group: IGroup) => void

  /**
   * Remove a group from this contact.
   * The group should be an existing group within the flow context.
   * If the group exists in the `groups` property of the contact, it will
   * be removed or marked as removed. If it does not already exist, nothing
   * happens.
   */
  delGroup: (group: IGroup) => void
}
