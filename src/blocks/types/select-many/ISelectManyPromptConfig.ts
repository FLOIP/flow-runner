/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IChoice, IPromptConfig} from '../../../index'

/**
 * Interface for defining an {@link IPromptConfig} resolving to a {@link SelectManyPrompt}.
 */
export interface ISelectManyPromptConfig extends IPromptConfig<IChoice['key'][] | null> {
  kind: string
  choices: IChoice[]
}
