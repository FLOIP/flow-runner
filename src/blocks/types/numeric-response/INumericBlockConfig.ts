/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {ISetContactPropertyBlockConfig} from '../../..'

export interface INumericBlockConfig extends ISetContactPropertyBlockConfig {
  prompt: string
  promptAudio: string
  validationMinimum: number
  validationMaximum: number

  ivr: {
    maxDigits: number
  }
}
