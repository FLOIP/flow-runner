import {IPromptConfig, KnownPrompts} from './IPrompt'

export interface ISelectOnePromptConfig extends IPromptConfig<string | null> {
  kind: KnownPrompts.SelectOne,
  choices: string[],
}