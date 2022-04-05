import {SupportedMode} from '..'

export interface IResourceValue {
  language_id: string
  content_type: string
  mime_type?: string
  modes: SupportedMode[]
  /**
   * Value will accept alphanumerics, white spaces, file path, expressions, conditions,
   * @pattern ^[\w \\\/@:,.!?+*^<>=()"'-]+$
   * @format floip-expression
   */
  value: string
}

export interface IResource {
  uuid: string
  // each describes the resource content to use for a content_type
  values: IResourceValue[]
}

export type IResources = IResource[]
