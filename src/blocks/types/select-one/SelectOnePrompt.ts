/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {BasePrompt, ISelectOnePromptConfig, ValidationException} from '../../../index'

export const SELECT_ONE_PROMPT_KEY = 'SelectOne'

/**
 * Concrete implementation of {@link BasePrompt} to request, at most, one selection from multiple choices, from an
 * {@link IContact}.
 */
export class SelectOnePrompt extends BasePrompt<ISelectOnePromptConfig> {
  validate(choiceKey?: string | null): boolean {
    const {isResponseRequired, choices} = this.config

    if (isResponseRequired && choices.find(({key}) => key === choiceKey) == null) {
      throw new ValidationException('Value provided must be in list of choices')
    }

    return true
  }
}
