import BasePrompt from './BasePrompt'
import {IBasePromptConfig} from './IPrompt'
import {IOpenPromptConfig} from './IOpenPromptConfig'
import ValidationException from '../exceptions/ValidationException'

export default class OpenPrompt extends BasePrompt<IOpenPromptConfig & IBasePromptConfig> {
  validate(val: string): boolean {
    const {maxResponseCharacters: maxLength} = this.config

    if (maxLength && val.length > maxLength) {
      // todo: add ability to provide validation codes to ValidationException for use as comparator in consumers
      // todo: need a method to define resources frontend needs from backend
      throw new ValidationException('Too many characters on value provided')
    }

    return true
  }
}
