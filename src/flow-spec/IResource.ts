import {SupportedMode} from '..'
import {SupportedContentType} from '../domain/SupportedContentType'

export interface IResourceValue {
  language_id: string
  content_type: SupportedContentType
  mime_type?: string
  modes: SupportedMode[]
  value: string
}

export interface IResource {
  uuid: string
  values: IResourceValue[] // each describes the resource content to use for a content_type
}

export type IResources = IResource[]
