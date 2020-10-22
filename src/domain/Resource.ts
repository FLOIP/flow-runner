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

import {
  createEvalContextFrom,
  IContext,
  IResource,
  IResourceDefinitionContentTypeSpecific,
  ResourceNotFoundException,
  SupportedContentType,
} from '..'
import {EvaluatorFactory} from '@floip/expression-evaluator'

export class Resource implements IResource {
  constructor(public uuid: string, public values: IResourceDefinitionContentTypeSpecific[], public context: IContext) {}

  _getValueByContentType(contentType: SupportedContentType): string {
    const def = this._findByContentType(contentType)

    if (def == null) {
      const {languageId, mode} = this.context
      throw new ResourceNotFoundException(
        `Unable to find resource for ${JSON.stringify({
          contentType,
          languageId,
          mode,
        })}`
      )
    }

    return def.value
  }

  _hasByContentType(contentType: SupportedContentType): boolean {
    return this._findByContentType(contentType) != null
  }

  _findByContentType(contentType: SupportedContentType): IResourceDefinitionContentTypeSpecific | undefined {
    return this.values.find(def => def.contentType === contentType)
  }

  getAudio(): string {
    return this._getValueByContentType(SupportedContentType.AUDIO)
  }

  getImage(): string {
    return this._getValueByContentType(SupportedContentType.IMAGE)
  }

  getText(): string {
    return EvaluatorFactory.create().evaluate(this._getValueByContentType(SupportedContentType.TEXT), createEvalContextFrom(this.context))
  }

  getVideo(): string {
    return this._getValueByContentType(SupportedContentType.VIDEO)
  }

  getCsv(): string {
    return this._getValueByContentType(SupportedContentType.CSV)
  }

  get(key: string): string {
    return this._getValueByContentType(key)
  }

  hasAudio(): boolean {
    return this._hasByContentType(SupportedContentType.AUDIO)
  }

  hasImage(): boolean {
    return this._hasByContentType(SupportedContentType.IMAGE)
  }

  hasText(): boolean {
    return this._hasByContentType(SupportedContentType.TEXT)
  }

  hasVideo(): boolean {
    return this._hasByContentType(SupportedContentType.VIDEO)
  }

  hasCsv(): boolean {
    return this._hasByContentType(SupportedContentType.CSV)
  }

  has(key: string): boolean {
    return this._hasByContentType(key)
  }
}
