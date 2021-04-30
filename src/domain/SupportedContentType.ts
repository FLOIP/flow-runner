/**
 * Supported content types for Resources: https://floip.gitbook.io/flow-specification/flows#resources
 *
 * This is a custom Dynamic Enum for SupportedContentTypes, that allows adding of custom values at runtime, by calling
 * `SupportedContentType.addCustomSupportedContentType()`.
 */
export enum SupportedContentType {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DATA = 'DATA',
}
