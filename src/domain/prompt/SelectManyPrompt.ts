import BasePrompt from './BasePrompt'
import {IBasePromptConfig} from './IPrompt'
import ValidationException from '../exceptions/ValidationException'
import {ISelectManyPromptConfig} from './ISelectManyPromptConfig'
import {difference, map} from 'lodash'
import {IChoice} from './ISelectOnePromptConfig'
import InvalidChoiceException from '../exceptions/InvalidChoiceException'

export const INVALID_AT_LEAST_ONE_SELECTION_REQUIRED = 'At least one selection is required, but none provided'
export const INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK = 'All selections must be valid choices on block'

export default class SelectManyPrompt extends BasePrompt<ISelectManyPromptConfig & IBasePromptConfig> {
  validate(selections: IChoice['key'][]) {
    const {isResponseRequired, choices} = this.config

    if (!isResponseRequired) {
      return true
    }

    if (selections.length === 0) {
      throw new ValidationException(INVALID_AT_LEAST_ONE_SELECTION_REQUIRED)
    }

    const invalidChoices = difference(selections, map(choices, 'key'))
    if (invalidChoices.length !== 0) {
      throw new InvalidChoiceException<IChoice['key']>(INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK, invalidChoices)
    }

    return true
  }
}