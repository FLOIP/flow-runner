import BasePrompt from './BasePrompt'
import {INumericPromptConfig} from './INumericPromptConfig'
import {IBasePromptConfig} from './IPrompt'
import ValidationException from '../exceptions/ValidationException'

export class NumericPrompt extends BasePrompt<INumericPromptConfig & IBasePromptConfig> {

  validate(val: number): boolean {
    if (Number.isNaN(val) || val === null) {
      return false
    }

    const {min, max} = this.config

    if (min != null && val < min) {
      throw new ValidationException('Value provided is less than allowed')
    }

    if (max != null && val > max) {
      throw new ValidationException('Value provided is greater than allowed')
    }

    return true
  }
}

export default NumericPrompt