/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {BasePrompt, INumericPromptConfig, ValidationException} from '../../../index'

export const NUMERIC_PROMPT_KEY = 'Numeric'

/**
 * Concrete implementation of {@link BasePrompt} to request a number, optionally within particular bounds, from an
 * {@link IContact}.
 */
export class NumericPrompt extends BasePrompt<INumericPromptConfig> {
  static readonly promptKey = 'Numeric'

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
