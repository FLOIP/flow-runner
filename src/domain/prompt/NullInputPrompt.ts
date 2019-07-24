import BasePrompt from "./BasePrompt";

export class NullInputPrompt extends BasePrompt<null> { // message block?
  validate(val?: null): true {
    return true
  }
}