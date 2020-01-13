import {IPromptConfig, KnownPrompts} from './IPrompt'
import IReadBlockConfig from '../../model/block/IReadBlockConfig'

export type TReadableType = string | number | null

export interface IReadPromptConfig extends IPromptConfig<TReadableType[]>, IReadBlockConfig {
  kind: KnownPrompts.Read
}
