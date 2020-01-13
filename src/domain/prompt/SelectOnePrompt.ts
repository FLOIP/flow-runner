import BasePrompt from './BasePrompt'
import {IBasePromptConfig} from './IPrompt'
import ValidationException from '../exceptions/ValidationException'
import {ISelectOnePromptConfig} from './ISelectOnePromptConfig'

export class SelectOnePrompt extends BasePrompt<ISelectOnePromptConfig & IBasePromptConfig> {
  validate(choiceKey: string) {
    const {isResponseRequired, choices} = this.config

    if (isResponseRequired
      && choices.find(({key}) => key === choiceKey) == null) {
      throw new ValidationException('Value provided must be in list of choices')
    }

    return true
  }
}

export default SelectOnePrompt