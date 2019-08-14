import BasePrompt from "./BasePrompt";
import {INumericPromptConfig} from "./INumericPromptConfig";
import {IBasePromptConfig} from "./IPrompt";

export default class extends BasePrompt<INumericPromptConfig & IBasePromptConfig> {

  validate(val: number): boolean {
    return val >= this.config.min
        && val <= this.config.max
  }
}
