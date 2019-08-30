import {SupportedMode} from '..'


export enum SupportedContentType {
  TEXT = 'text',
  AUDIO = 'audio',
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface IResourceDefinitionContentTypeSpecific {
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
  criteria: {
    languageId: string
    modes: SupportedMode[]
  }

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
  resources: IResources

  resolve(
    resourceId: string,
    modes: SupportedMode[],
    languageId: string): IResource
}
