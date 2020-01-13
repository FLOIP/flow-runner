import PromptValidationException from '../exceptions/PromptValidationException'
import IFlowRunner from '../IFlowRunner'
import {TRichCursorInputRequired} from '../..'


export interface IPrompt<PromptConfigType extends IPromptConfig<PromptConfigType['value']> & IBasePromptConfig> {
  interactionId: string
  config: PromptConfigType
  runner: IFlowRunner

  // todo: need to validate on instantiation?
  value: PromptConfigType['value'] // when setting: (this.value = value) && this.validate() --- todo: should this property be reactive?
  error: PromptValidationException | null
  isValid: boolean // !this.error

  validate(val: PromptConfigType['value']): boolean // it will raise an exception when it's invalid
  fulfill(val: PromptConfigType['value']): TRichCursorInputRequired | undefined
}

export default IPrompt

// todo: implement a pattern using Generics
//       via https://stackoverflow.com/questions/46025487/create-extendable-enums-for-use-in-extendable-interfaces
export enum KnownPrompts {
  Message = 'Message',
  Numeric = 'Numeric',
  SelectOne = 'SelectOne',
  SelectMany = 'SelectMany',
  Open = 'Open',
  Read = 'Read',
}


export interface IPromptConfig<ExpectationType> {
  kind: keyof typeof KnownPrompts
  isResponseRequired: boolean
  prompt: string
  value?: ExpectationType
}


export interface IBasePromptConfig {
  isSubmitted: boolean
}