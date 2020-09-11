/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IPromptConfig} from '../../../index'

// todo: can our value type use some fancy keyof magic to say we need a value that's of the type of one of the {key} props in choices?
/**
 * Interface for defining an {@link IPromptConfig} resolving to a {@link SelectOnePrompt}.
 */
export interface ISelectOnePromptConfig extends IPromptConfig<string | null> {
  kind: string
  choices: IChoice[]
  emptyChoicesMessage?: string
}

export interface IChoice {
  key: string
  value: string
}
