// import UUID32 from "../../model/UUID32"
// import UUID64 from "../../model/UUID64"
import IPrompt from "./IPrompt";
import PromptValidationException from "../exceptions/PromptValidationException";
import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import {INumericPromptConfig} from "./INumericPromptConfig";
import {IMessagePromptConfig} from "./IMessagePromptConfig";
import {ISelectOnePromptConfig} from "./ISelectOnePromptConfig";
import {IOpenPromptConfig} from "./IOpenPromptConfig";


export type IPromptExpectationTypes = string | number | string[] | number[] | null

export interface IPromptConfig {
  // todo: make `kind` extensible -- future prompt types need to modify this declaration in order to extend behaviour
  kind: 'Message'
      | 'Numeric'
      | 'SelectOne'
      | 'Open'
  isResponseRequired: boolean
  value: IPromptExpectationTypes
}

export type IPromptConfigTypes
    = IMessagePromptConfig
    & INumericPromptConfig
    & ISelectOnePromptConfig
    & IOpenPromptConfig

export interface IBasePromptConfig {
  isSubmitted: boolean
}

// type Validator = <PromptType>(val: PromptType) => boolean
// type x = {<PromptType>(arg: PromptType): PromptType}

export default abstract class <PromptExpectationType,
                               PromptConfigType extends IPromptConfigTypes>
    implements IPrompt<PromptExpectationType, PromptConfigType> {

  error: PromptValidationException | null

  constructor(
      // todo: figure out a nice pattern for hydrating UUIDs
      public block: string,//UUID32, // todo: migrate to a block to mitigate recreating structures around configuration
      public interaction: IBlockInteraction,
      public config: PromptConfigType & IBasePromptConfig,) {

      // todo: add canPerformEarlyExit() behaviour
  }

  get value() { // todo: need a simple way to specify type as typeof <IPrompt['value']> corresponding to generics injection for this instance
    return this.config.value
  }

  set value(val: PromptExpectationType) {
    try {
      this.validate(val)
    } catch (e) {
      if (!(e instanceof PromptValidationException)) {
        throw e
      }

      this.error = e
    }

    this.config.value = val
  }

  abstract validate(val: PromptExpectationType): boolean
}
