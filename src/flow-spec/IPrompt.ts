// import UUID32 from "../model/UUID32";
// import UUID64 from "../model/UUID64";
import {PromptExpectationsType} from "../domain/prompt/BasePrompt";
import PromptValidationException from "../domain/exceptions/PromptValidationException";

// todo: we need a smart way to marshall this data type (aka. hydrate into this type)
//       Maybe cursor only holds the data, and we access the cursor through the runner
//       FlowRunner.getRichCursor() could look different than `{cursor}: IContext`

export default interface IPrompt<PromptType extends PromptExpectationsType> { // todo: how do I type that validate need take in PromptType.type's type?
  blockId: string//UUID32
  blockInteractionId: string//UUID64
  isResponseRequired: boolean
  value: PromptType // when setting: (this.value = value) && this.validate() --- todo: should this property be reactive?
  error: PromptValidationException | null
  isValid: boolean // !this.error
  isSubmitted: boolean // whether or not has been handled by FlowRunner

  validate(val: PromptType): true // it will raise an exception when it's invalid
}
