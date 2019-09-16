import {SupportedMode} from '..'
import IContext from '../flow-spec/IContext'


export enum SupportedContentType {
  TEXT = 'text',
  AUDIO = 'audio',
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface IResourceDefinitionContentTypeSpecific { // todo: rename to IResourceDefinitionVariant
  languageId: string
  contentType: SupportedContentType
  modes: SupportedMode[]
  value: string
}

export interface IResourceDefinition {
  uuid: string
  values: IResourceDefinitionContentTypeSpecific[] // each to be tailored to a particular content type
}

export type IResources = IResourceDefinition[]

/** Basically, a smarter version of an IResourceDefinition with
 * her values having been filtered by (languageId, modes). */
export interface IResource {
  uuid: string
  values: IResourceDefinitionContentTypeSpecific[]
  context: IContext

  hasText(): boolean
  /** @throws ResourceNotFoundException */
  getText(): string

  hasAudio(): boolean
  /** @throws ResourceNotFoundException */
  getAudio(): string

  hasImage(): boolean
  /** @throws ResourceNotFoundException */
  getImage(): string

  hasVideo(): boolean
  /** @throws ResourceNotFoundException */
  getVideo(): string
}

export default interface IResourceResolver {
  context: IContext

  resolve(resourceId: string): IResource
}

export function createTextResourceVariantWith(value: string, ctx: IContext): IResourceDefinitionContentTypeSpecific {
  return {
    contentType: SupportedContentType.TEXT,
    value,
    languageId: ctx.languageId,
    modes: [ctx.mode],
  }
}