/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

/**
 * Generic exception for selection validation; typically leveraged by {@link IPrompt} implementations.
 */
export class InvalidChoiceException<ChoiceType> extends Error {
  constructor(message?: string, public choices?: ChoiceType[]) {
    super(message)
  }
}
