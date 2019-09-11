export default interface IOpenResponseBlockConfig {
  prompt: string
  promptAudio: string

  ivr: {
    maxDurationSeconds: number
  }

  text: {
    maxResponseCharacters?: number
  }
}