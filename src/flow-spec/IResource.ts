import {SupportedMode} from '..'

export interface IResourceValue {
  language_id: string
  content_type: string
  mime_type?: string
  modes: SupportedMode[]
  /**
   * Value will accept text and file path (eg: my-path/the_file.mp3)
   * @pattern ^[\w\\\/.-]+$
   */
  value: string
}

export interface IResource {
  uuid: string
  // each describes the resource content to use for a content_type
  values: IResourceValue[]
}

export type IResources = IResource[]
