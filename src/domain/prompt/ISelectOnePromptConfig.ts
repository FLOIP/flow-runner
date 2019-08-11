import {IPromptConfig} from "./BasePrompt";

export interface ISelectOnePromptConfig extends IPromptConfig {
  kind: 'SelectOne'
  choices: string[]
}
