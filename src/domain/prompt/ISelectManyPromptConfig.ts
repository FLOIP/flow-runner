import {IPromptConfig, KnownPrompts} from './IPrompt'
import {IChoice} from './ISelectOnePromptConfig'


export interface ISelectManyPromptConfig extends IPromptConfig<IChoice['key'][] | null> {
  kind: KnownPrompts.SelectMany
  choices: IChoice[]
}
