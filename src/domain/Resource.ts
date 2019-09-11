import {pick} from 'lodash'
import {IResource, IResourceDefinitionContentTypeSpecific, SupportedContentType} from './IResourceResolver'
import ResourceNotFoundException from './exceptions/ResourceNotFoundException'
import IContext from '../flow-spec/IContext'
import {EvaluatorFactory} from 'floip-expression-evaluator-ts'

export class Resource implements IResource {
  constructor(
    public uuid: string,
    public values: IResourceDefinitionContentTypeSpecific[],
    public context: IContext) {
  }

  _getValueByContentType(contentType: SupportedContentType): string {
    const def = this._findByContentType(contentType)

    if (def == null) {
      const {languageId, mode} = this.context
      throw new ResourceNotFoundException(`Unable to find resource for ${JSON.stringify({contentType, languageId, mode})}`)
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
    return EvaluatorFactory.create()
      .evaluate(
        this._getValueByContentType(SupportedContentType.TEXT),
        pick(this.context, ['contact']))
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
