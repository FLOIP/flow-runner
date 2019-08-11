import {IPromptConfig} from "./BasePrompt";

export interface INumericPromptConfig extends IPromptConfig {
  kind: 'Numeric'
  min: number
  max: number
  maxLength: number
}


// // Prompt Type Mappings
// type SpecializedPromptExpectationTypeMap = {
//   Numeric: number,
//   Message: void,
// }
//
// type SpecializedPromptConfigTypeMap = {
//   Numeric: INumericPromptConfig,
//   Message: IMessagePromptConfig,
// }
//
// type PromptKindWithMapping = keyof SpecializedPromptConfigTypeMap
// interface IPromptConfigWithMapping = {
//   kind: PromptKindWithMapping
// }
//
// type PromptConfigSpecialization<T extends PromptConfigWithMapping>
//     = {[K in keyof SpecializedPromptConfigTypeMap[T['kind']]]: SpecializedPromptConfigTypeMap[T['kind']][K]}
//
//
// type BaseConfig<T extends PromptConfigWithMapping> = {
//   value?: SpecializedPromptExpectationTypeMap[T['kind']]
//   blockId: string
//   blockInteractionId: string
//
//   isResponseRequired: boolean
//   isValid: boolean
//   isSubmitted: boolean
// }
//
//
// type TFullPromptConfig<T extends PromptKindWithMapping>
//     = PromptConfigSpecialization<PromptConfigWithMapping>
//     & BaseConfig<PromptConfigWithMapping>
