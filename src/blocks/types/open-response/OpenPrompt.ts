/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {BasePrompt, IOpenPromptConfig, ValidationException} from '../../../index'

export const OPEN_PROMPT_KEY = 'Open'

/**
 * Concrete implementation of {@link BasePrompt} to request a string of text, optionally with a maximum length boundary,
 * from an {@link IContact}.
 */
export class OpenPrompt extends BasePrompt<IOpenPromptConfig> {
  validate(val: string): boolean {
    const {maxResponseCharacters: maxLength} = this.config

    if (maxLength != null && val.length > maxLength) {
      // todo: add ability to provide validation codes to ValidationException for use as comparator in consumers
      // todo: need a method to define resources frontend needs from backend
      throw new ValidationException('Too many characters on value provided')
    }

    return true
  }
}
