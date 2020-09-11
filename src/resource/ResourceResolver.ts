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

import {createTextResourceVariantWith, IContext, IResource, IResourceResolver, Resource, ResourceNotFoundException} from '../index'
import {intersection} from 'lodash'

const UUID_MATCHER = /[\d\w]{8}(-[\d\w]{4}){3}-[\d\w]{12}/i

function isUUID(uuid: string): boolean {
  return uuid.length === 36 && UUID_MATCHER.test(uuid)
}

export class ResourceResolver implements IResourceResolver {
  constructor(public context: IContext) {}

  resolve(resourceId: string): IResource {
    const {mode, languageId} = this.context

    if (!isUUID(resourceId)) {
      return new Resource(resourceId, [createTextResourceVariantWith(resourceId, this.context)], this.context)
    }

    const resource = this.context.resources.find(({uuid}) => uuid === resourceId)

    if (resource == null) {
      throw new ResourceNotFoundException(
        `No resource matching ${JSON.stringify(resourceId)} for ${JSON.stringify({
          mode,
          languageId,
        })}`
      )
    }

    const values = resource.values.filter(def => def.languageId === languageId && intersection(def.modes, [mode]).length > 0)

    return new Resource(resourceId, values, this.context)
  }
}
