export default interface ISelectOneResponseBlockConfig {
  prompt: string,
  promptAudio: string,
  questionPrompt?: string,
  choicesPrompt?: string,
  choices: Map<string, string>, // todo: choice should be a type like {id, resource, value}
}