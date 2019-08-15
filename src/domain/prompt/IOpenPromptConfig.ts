import {IPromptConfig, KnownPrompts} from './IPrompt'

export interface IOpenPromptConfig extends IPromptConfig<string | null> {
  kind: KnownPrompts.Open,
}