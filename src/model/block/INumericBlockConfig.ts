export default interface INumericBlockConfig {
  prompt: string
  'prompt-audio': string
  'validation-minimum': number // todo: this should be camel-cased
  'validation-maximum': number // todo: this should be camel-cased

  ivr: {
    'max-digits': number
  }
}
