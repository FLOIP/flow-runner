/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

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
