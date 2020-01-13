export interface INumericBlockConfig {
  prompt: string
  promptAudio: string
  validationMinimum: number
  validationMaximum: number

  ivr: {
    maxDigits: number
  }
}

export default INumericBlockConfig