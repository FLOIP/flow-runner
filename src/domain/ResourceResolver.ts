import IResourceResolver, {
  IResource,
  IResourceDefinitionContentTypeSpecific,
  IResources,
  SupportedContentType,
} from './IResourceResolver'
import {SupportedMode} from '..'
import {Resource} from './Resource'
import {intersection} from 'lodash'
import ResourceNotFoundException from './exceptions/ResourceNotFoundException'

const UUID_MATCHER = /[\d\w]{8}(-[\d\w]{4}){3}-[\d\w]{12}/i

function isUUID(uuid: string): boolean {
  return uuid.length === 36
    && UUID_MATCHER.test(uuid)
}

export default class ResourceResolver implements IResourceResolver {
  constructor(
    public modes: SupportedMode[],
    public languageId: string,
    public resourceDefinitions: IResources = []) {
  }

  resolve(resourceId: string): IResource {
    const {modes, languageId} = this

    if (!isUUID(resourceId)) {
      return new Resource(
        resourceId,
        [this.createTextResourceVariantWith(resourceId)],
        {languageId, modes})
    }

    const resource = this.resourceDefinitions.find(({uuid}) => uuid === resourceId)

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

  createTextResourceVariantWith(value: string): IResourceDefinitionContentTypeSpecific {
    const {modes, languageId} = this
    return {
      contentType: SupportedContentType.TEXT,
      value,
      languageId,
      modes,
    }
  }
}