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

import {IContext, SupportedContentType, ResourceResolver, SupportedMode} from '..'
import {IResource, IResourceValue} from '../flow-spec/IResource'

/**
 * Resource definition: https://floip.gitbook.io/flow-specification/flows#resources
 *
 * Basically, a smarter version of an IResource with
 * her values having been filtered by (languageId, modes). */
export interface IResourceWithContext extends IResource {
  uuid: string
  values: IResourceValue[]
  context: IContext

  /** @throws ResourceNotFoundException */
  getText(): string

  hasText(): boolean

  /** @throws ResourceNotFoundException */
  getAudio(): string

  hasAudio(): boolean

  /** @throws ResourceNotFoundException */
  getImage(): string

  hasImage(): boolean

  /** @throws ResourceNotFoundException */
  getVideo(): string

  hasVideo(): boolean

  /** @throws ResourceNotFoundException */
  getCsv(): string

  hasCsv(): boolean

  /** @throws ResourceNotFoundException */
  get(key: string): string

  has(key: string): boolean
}

export interface IResourceResolver {
  context: IContext

  resolve(resourceId: string): IResourceWithContext
}

export function createTextResourceVariantWith(value: string, ctx: IContext): IResourceValue {
  return {
    content_type: SupportedContentType.TEXT,
    value,
    language_id: ctx.language_id,
    modes: [ctx.mode],
  }
}

export function getResource(context: IContext, resourceId: string): IResourceWithContext {
  return new ResourceResolver(context).resolve(resourceId)
}
