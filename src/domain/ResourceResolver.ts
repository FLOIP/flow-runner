import IResourceResolver, {IResource, IResources, SupportedContentType} from './IResourceResolver'
import {SupportedMode} from '..'
import {Resource} from './Resource'
import {intersection} from 'lodash'
import ResourceNotFoundException from './exceptions/ResourceNotFoundException'

const UUID_MATCHER = /[\d\w]{8}(-[\d\w]{4}){3}-[\d\w]{12}/i

function isUUID(uuid: string) {
  return uuid.length === 36
    && UUID_MATCHER.test(uuid)
}

export default class ResourceResolver implements IResourceResolver {
  constructor(
    public resources: IResources = []) {
  }

  resolve(resourceId: string, modes: SupportedMode[], languageId: string): IResource {
    if (!isUUID(resourceId)) {
      return new Resource(resourceId, [{
        contentType: SupportedContentType.TEXT,
        value: resourceId,
        languageId,
        modes,
      }], {languageId, modes})
    }

    const resource = this.resources.find(({uuid}) => uuid === resourceId)

    if (resource == null) {
      throw new ResourceNotFoundException(`No resource matching ${JSON.stringify(resourceId)} for ${JSON.stringify({
        modes,
        languageId,
      })}`)
    }

    const values = resource.values.filter(def => def.languageId === languageId
                                                 && intersection(def.modes, modes).length > 0)

    return new Resource(resourceId, values, {languageId, modes})
  }
}