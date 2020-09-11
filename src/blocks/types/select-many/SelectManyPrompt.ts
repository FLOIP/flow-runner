/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {BasePrompt, IChoice, InvalidChoiceException, ISelectManyPromptConfig, ValidationException} from '../../../index'
import {difference, map} from 'lodash'

export const INVALID_AT_LEAST_ONE_SELECTION_REQUIRED = 'At least one selection is required, but none provided'
export const INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK = 'All selections must be valid choices on block'
export const SELECT_MANY_PROMPT_KEY = 'SelectMany'

/**
 * Concrete implementation of {@link BasePrompt} to request a selection from multiple choices, optionally requiring at
 * least one, from an {@link IContact}.
 */
export class SelectManyPrompt extends BasePrompt<ISelectManyPromptConfig> {
  validate(selections: IChoice['key'][]): boolean {
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
