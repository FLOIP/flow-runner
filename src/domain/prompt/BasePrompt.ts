// import UUID32 from "../../model/UUID32"
// import UUID64 from "../../model/UUID64"
import IPrompt from "../../flow-spec/IPrompt";
import PromptValidationException from "../exceptions/PromptValidationException";


export type PromptExpectationsType = string | number | string[] | number[] | null

// type Validator = <PromptType>(val: PromptType) => boolean
// type x = {<PromptType>(arg: PromptType): PromptType}

export default abstract class <PromptType extends PromptExpectationsType>
    implements IPrompt<PromptType> {

  error: PromptValidationException | null

  constructor(
      // todo: figure out a nice pattern for hydrating UUIDs
      public blockId: string,//UUID32, // todo: migrate to a block to mitigate recreating structures around configuration
      public blockInteractionId: string,//UUID64,
      protected _value: PromptType,
      public isResponseRequired: boolean = false,
      public isValid: boolean = false,
      public isSubmitted: boolean = false,) {
      // todo: canPerformEarlyExit()
  }

  get value() {
    return this._value
  }

  set value(val: PromptType) {
    try {
      this.validate(val)
      this._value = val
    } catch (e) {
      if (!(e instanceof PromptValidationException)) {
        throw e
      }

      this._value = val
      this.error = e
    }
  }

  abstract validate(val: PromptType): true
}
