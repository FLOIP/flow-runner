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

import {IFlow, IResource} from '..'

/**
 * Flow Containers hold a group of related Flows: https://floip.gitbook.io/flow-specification/flows#flows
 */
export interface IContainer {
  /**
   * The version of the Flow Spec that this package is compliant with, e.g. 1.0.0-rc1
   */
  specification_version: string

  /**
   * A globally unique identifier for this Container.  (See UUID Format: https://floip.gitbook.io/flow-specification/flows#uuid-format)
   *
   * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
   */
  uuid: string

  /**
   * A human-readable name for the Container content.
   */
  name: string

  /**
   * An extended human-readable description of the content.
   */
  description?: string

  /**
   * A set of key-value elements that is not controlled by the Specification,
   * but could be relevant to a specific vendor/platform/implementation.
   */
  vendor_metadata?: object

  /**
   * A list of the Flows within the Container (see below)
   */
  flows: IFlow[]

  /**
   * A set of the Resources needed for executing the Flows in the Container, keyed by resource uuid.
   */
  resources: IResource[]
}
