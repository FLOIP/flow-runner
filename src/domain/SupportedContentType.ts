/**
 * This is a custom Dynamic Enum for SupportedContentTypes, that allows adding of custom values at runtime, by calling
 * `SupportedContentType.addCustomSupportedContentType()`.
 */
export class SupportedContentType {
  static TEXT = 'text'
  static AUDIO = 'audio'
  static IMAGE = 'image'
  static VIDEO = 'video'
  static CSV = 'csv'
}
