// import UUID32 from "../model/UUID32";
// import UUID64 from "../model/UUID64";
import PromptValidationException from "../exceptions/PromptValidationException";
import IBlock from "../../flow-spec/IBlock";
import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import {IBasePromptConfig, IPromptConfigTypes, IPromptExpectationTypes} from "./BasePrompt";

// todo: we need a smart way to marshall this data type (aka. hydrate into this type)
//       Maybe cursor only holds the data, and we access the cursor through the runner
//       FlowRunner.getRichCursor() could look different than `{cursor}: IContext`

export default interface IPrompt<PromptExpectationType, PromptConfigType extends IPromptConfigTypes> {
  block: IBlock
  blockInteraction: IBlockInteraction
  config: PromptConfigType & IBasePromptConfig

  // todo: need to validate on instantiation?
  value: IPromptExpectationTypes // when setting: (this.value = value) && this.validate() --- todo: should this property be reactive?
  error: PromptValidationException | null
  isValid: boolean // !this.error

  validate(val: PromptExpectationType): boolean // it will raise an exception when it's invalid
}
