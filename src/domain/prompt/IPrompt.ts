// import UUID32 from "../model/UUID32";
// import UUID64 from "../model/UUID64";
import PromptValidationException from '../exceptions/PromptValidationException'
import IBlock from '../../flow-spec/IBlock'
import IBlockInteraction from '../../flow-spec/IBlockInteraction'


export default interface IPrompt<PromptConfigType extends IPromptConfig<PromptConfigType['value']> & IBasePromptConfig> {
  block: IBlock,
  interaction: IBlockInteraction,
  config: PromptConfigType,

  // todo: need to validate on instantiation?
  value: PromptConfigType['value'], // when setting: (this.value = value) && this.validate() --- todo: should this property be reactive?
  error: PromptValidationException | null,
  isValid: boolean, // !this.error

  validate(val: PromptConfigType['value']): boolean, // it will raise an exception when it's invalid
}


// export enum KnownPrompts {}
export enum KnownPrompts {
  Message,
  Numeric,
  SelectOne,
  Open,
}


export interface IPromptConfig<ExpectationType> {
  kind: KnownPrompts,
  isResponseRequired: boolean,
  value: ExpectationType,
}


export interface IBasePromptConfig {
  isSubmitted: boolean,
}