export default interface ISelectOneResponseBlockConfig {
  prompt: string
  'prompt-audio': string
  'question-prompt'?: string
  'choices-prompt'?: string
  choices: Map<string, string> // todo: choice should be a type like {id, resource, value}
}
