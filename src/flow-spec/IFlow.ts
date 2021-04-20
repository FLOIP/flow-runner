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

import {IBlock, ILanguage, SupportedMode, ValidationException} from '..'
import {find} from 'lodash'

/**
 * Flow structure: https://floip.gitbook.io/flow-specification/flows#flows
 */
export interface IFlow {
  /**
   * A globally unique identifier for this Flow.  (See UUID Format: https://floip.gitbook.io/flow-specification/flows#uuid-format)
   *
   * @pattern ^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$
   */
  // UUID32
  uuid: string

  /**
   * A human-readable name for the Flow content
   */
  name: string

  /**
   * An extended user-provided description for the flow.
   */
  label?: string

  /**
   * The time when this flow was last modified, in UTC, with microsecond precision: "2016-12-25 13:42:05.234598"
   *
   * @format date-time
   */
  // UTC like: 2016-12-25 13:42:05.234598
  last_modified: string

  /**
   * The number of seconds of inactivity after which Contact input for this flow is no longer accepted, and Runs in progress are terminated
   *
   * @minimum 0
   * @type integer // TODO: this is not working, nor: @type `integer`
   */
  interaction_timeout: number

  /**
   * A set of key-value elements that is not controlled by the Specification,
   * but could be relevant to a specific vendor/platform/implementation.
   */
  vendor_metadata?: object

  /**
   * A list of the supported Modes that the Flow has content suitable for.
   *
   * @minItems 1
   */
  supported_modes: SupportedMode[]

  /**
   * A list of the languages that the Flow has suitable content for.
   * See language object specification: https://floip.gitbook.io/flow-specification/flows#language-objects-and-identifiers.
   *
   * @minItems 1
   */
  languages: ILanguage[]

  /**
   * A list of the Blocks in the flow.
   *
   * @minItems 1
   */
  blocks: IBlock[]

  /**
   * The ID of the block in blocks that is at the beginning of the flow.
   *
   * @pattern ^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$
   */
  first_block_id: string

  /**
   * If provided, the ID of the block in blocks that will be jumped to if there is an error or deliberate exit condition during Flow Run.
   * If not provided, the Flow Run will end immediately.
   *
   * @pattern ^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$
   */
  exit_block_id?: string
}

export function findBlockWith(uuid: string, {blocks}: IFlow): IBlock {
  const block = find(blocks, {uuid})
  if (block == null) {
    throw new ValidationException('Unable to find block on flow')
  }

  return block
}

export interface IFlowService {
  findBlockWith(uuid: string, flow: IFlow): IBlock
}
