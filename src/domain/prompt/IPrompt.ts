// import UUID32 from "../model/UUID32";
// import UUID64 from "../model/UUID64";
import PromptValidationException from '../exceptions/PromptValidationException'


export default interface IPrompt<PromptConfigType extends IPromptConfig<PromptConfigType['value']> & IBasePromptConfig> {
  interactionId: string
  config: PromptConfigType

  // todo: need to validate on instantiation?
  value: PromptConfigType['value'] // when setting: (this.value = value) && this.validate() --- todo: should this property be reactive?
  error: PromptValidationException | null
  isValid: boolean // !this.error

  validate(val: PromptConfigType['value']): boolean // it will raise an exception when it's invalid
}


// export enum KnownPrompts {}
export enum KnownPrompts {
  Message = 'Message',
  Numeric = 'Numeric',
  SelectOne = 'SelectOne',
  SelectMany = 'SelectMany',
  Open = 'Open',
}


export interface IPromptConfig<ExpectationType> {
  kind: KnownPrompts
  isResponseRequired: boolean
  prompt: string
  value?: ExpectationType
}


export interface IBasePromptConfig {
  isSubmitted: boolean
}