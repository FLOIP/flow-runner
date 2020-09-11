/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {ISetContactPropertyBlockConfig} from '../../../index'

export interface IOpenResponseBlockConfig extends ISetContactPropertyBlockConfig {
  prompt: string
  promptAudio: string

  ivr?: {
    maxDurationSeconds: number
  }

  text?: {
    maxResponseCharacters?: number
  }
}
