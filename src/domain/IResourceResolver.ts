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

import {IContext, SupportedMode} from '..'

export enum SupportedContentType {
  TEXT = 'text',
  AUDIO = 'audio',
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface IResourceDefinitionContentTypeSpecific { // todo: rename to IResourceDefinitionVariant
  languageId: string,
  contentType: SupportedContentType,
  modes: SupportedMode[],
  value: string,
}

export interface IResourceDefinition {
  uuid: string,
  values: IResourceDefinitionContentTypeSpecific[], // each to be tailored to a particular content type
}

export type IResources = IResourceDefinition[]

/** Basically, a smarter version of an IResourceDefinition with
 * her values having been filtered by (languageId, modes). */
export interface IResource {
  uuid: string,
  values: IResourceDefinitionContentTypeSpecific[],
  context: IContext,

  hasText(): boolean,

  /** @throws ResourceNotFoundException */
  getText(): string,

  hasAudio(): boolean,

  /** @throws ResourceNotFoundException */
  getAudio(): string,

  hasImage(): boolean,

  /** @throws ResourceNotFoundException */
  getImage(): string,

  hasVideo(): boolean,

  /** @throws ResourceNotFoundException */
  getVideo(): string,
}

export interface IResourceResolver {
  context: IContext,

  resolve(resourceId: string): IResource,
}

export function createTextResourceVariantWith(value: string, ctx: IContext): IResourceDefinitionContentTypeSpecific {
  return {
    contentType: SupportedContentType.TEXT,
    value,
    languageId: ctx.languageId,
    modes: [ctx.mode],
  }
}
