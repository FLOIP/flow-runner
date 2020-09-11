/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {BasePrompt, IMessagePromptConfig} from '../../..'

export const MESSAGE_PROMPT_KEY = 'Message'

/**
 * Concrete implementation of {@link BasePrompt} to present a message to an {@link IContact}.
 */
export class MessagePrompt extends BasePrompt<IMessagePromptConfig> {
  validate(): boolean {
    return true
  }
}
