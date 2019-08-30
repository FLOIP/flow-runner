import {IResource, IResourceDefinitionContentTypeSpecific, SupportedContentType} from './IResourceResolver'
import {SupportedMode} from '..'
import ResourceNotFoundException from './exceptions/ResourceNotFoundException'

export class Resource implements IResource {
  constructor(
    public uuid: string,
    public values: IResourceDefinitionContentTypeSpecific[],
    public criteria: {
      languageId: string,
      modes: SupportedMode[],
    }) {
  }

  _getValueByContentType(contentType: SupportedContentType): string {
    const def = this._findByContentType(contentType)

    if (def == null) {
      const {criteria} = this
      throw new ResourceNotFoundException(`Unable to find resource for ${JSON.stringify({contentType, criteria})}`)
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
    return this._getValueByContentType(SupportedContentType.TEXT)
  }

  getVideo(): string {
    return this._getValueByContentType(SupportedContentType.VIDEO)
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
}
