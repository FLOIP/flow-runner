export interface ISelectOneResponseBlockConfig {
  prompt: string
  promptAudio: string
  questionPrompt?: string
  choicesPrompt?: string
  choices: StringMapType
}

export default ISelectOneResponseBlockConfig

type StringMapType = {[k: string]: string}
