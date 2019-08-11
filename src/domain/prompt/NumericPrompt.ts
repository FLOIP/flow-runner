import BasePrompt from "./BasePrompt";
import {INumericPromptConfig} from "./INumericPromptConfig";

export default class NumericPrompt extends BasePrompt<number, INumericPromptConfig> {

  validate(val: number): boolean {
    return val >= this.config.min
        && val <= this.config.max
  }
}
