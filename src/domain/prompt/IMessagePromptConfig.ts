import {IPromptConfig, KnownPrompts} from './IPrompt'

export interface IMessagePromptConfig extends IPromptConfig<null> {
  kind: KnownPrompts.Message,
}