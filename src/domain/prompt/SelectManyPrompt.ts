/**
 * Flow Interoperability Project (flowinterop.org)
 * Flow Runner
 * Copyright (c) 2019, 2020 Viamo Inc.
 * Authored by: Brett Zabos (brett.zabos@viamo.io)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/

import BasePrompt from './BasePrompt'
import {IBasePromptConfig} from './IPrompt'
import ValidationException from '../exceptions/ValidationException'
import {ISelectManyPromptConfig} from './ISelectManyPromptConfig'
import {difference, map} from 'lodash'
import {IChoice} from './ISelectOnePromptConfig'
import InvalidChoiceException from '../exceptions/InvalidChoiceException'

export const INVALID_AT_LEAST_ONE_SELECTION_REQUIRED = 'At least one selection is required, but none provided'
export const INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK = 'All selections must be valid choices on block'

/**
 * Concrete implementation of {@link BasePrompt} to request a selection from multiple choices, optionally requiring at
 * least one, from an {@link IContact}.
 */
export class SelectManyPrompt extends BasePrompt<ISelectManyPromptConfig & IBasePromptConfig> {
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

export default SelectManyPrompt
