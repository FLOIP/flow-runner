export default interface ISelectOneResponseBlockConfig {
  prompt: string
  promptAudio: string
  questionPrompt?: string
  choicesPrompt?: string
  choices: StringMapType
}

type StringMapType = {[k: string]: string}
