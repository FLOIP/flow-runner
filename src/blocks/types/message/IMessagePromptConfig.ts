/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IPromptConfig} from '../../..'

/**
 * Interface for defining an {@link IPromptConfig} resolving to a {@link MessagePrompt}.
 */
export interface IMessagePromptConfig extends IPromptConfig<null> {
  kind: 'Message'
}
