import {IPromptConfig, KnownPrompts} from './IPrompt'
import IReadBlockConfig from '../../model/block/IReadBlockConfig'


export interface IReadError {
  message: string
}

export type TReadableType = string | number

export interface IReadPromptConfig extends IPromptConfig<TReadableType[] | IReadError> {
  kind: KnownPrompts.Read
  formatString: IReadBlockConfig['formatString']
  destinationVariables: IReadBlockConfig['destinationVariables']
}
