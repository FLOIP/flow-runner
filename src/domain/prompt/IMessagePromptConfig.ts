import {IPromptConfig, KnownPrompts} from './IPrompt'

export interface IMessagePromptConfig extends IPromptConfig<undefined | null> {
  kind: KnownPrompts.Message,
}