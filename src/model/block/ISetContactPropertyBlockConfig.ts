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
import {IBlockConfig} from '../..'

export interface SetContactProperty {
  property_key: string
  /**
   * @format floip-expression
   */
  property_value: string
}

export interface ISetContactPropertyBlockConfig extends IBlockConfig {}

export interface ISetContactPropertyBlockConfigRequired extends ISetContactPropertyBlockConfig {
  set_contact_property: SetContactProperty
}

export function isSetContactPropertyConfig(thing: unknown): thing is ISetContactPropertyBlockConfigRequired {
  if (typeof thing === 'object' && thing !== null && 'set_contact_property' in thing) {
    const setContactProperty = (thing as ISetContactPropertyBlockConfigRequired).set_contact_property
    return isSetContactProperty(setContactProperty)
  }
  return false
}

export function isSetContactProperty(thing: unknown): thing is SetContactProperty {
  if (typeof thing === 'object' && thing !== null) {
    // noinspection SuspiciousTypeOfGuard
    return (
      'property_key' in thing &&
      'property_value' in thing &&
      typeof (thing as SetContactProperty).property_key === 'string' &&
      typeof (thing as SetContactProperty).property_value === 'string'
    )
  }
  return false
}
