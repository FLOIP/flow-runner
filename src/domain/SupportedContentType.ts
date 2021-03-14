/**
 * Supported content types for Resources: https://floip.gitbook.io/flow-specification/flows#resources
 *
 * This is a custom Dynamic Enum for SupportedContentTypes, that allows adding of custom values at runtime, by calling
 * `SupportedContentType.addCustomSupportedContentType()`.
 */
export class SupportedContentType {
  static TEXT = 'TEXT'
  static AUDIO = 'AUDIO'
  static IMAGE = 'IMAGE'
  static VIDEO = 'VIDEO'
  static CSV = 'CSV'
}
