import BasePrompt from "./BasePrompt";

export default class NumericPrompt extends BasePrompt<number | null> {


  validate(val: number): true {
    return true
  }
}