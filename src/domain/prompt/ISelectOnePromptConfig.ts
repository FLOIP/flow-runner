import {IPromptConfig, KnownPrompts} from './IPrompt'
import {IResource} from '../IResourceResolver'


// todo: can our value type use some fancy keyof magic to say we need a value that's of the type of one of the {key} props in choices?
export interface ISelectOnePromptConfig extends IPromptConfig<IChoice['key'] | null> {
  kind: KnownPrompts.SelectOne
  choices: IChoice[]
}

export interface IChoice {
  key: string
  value: IResource
}
