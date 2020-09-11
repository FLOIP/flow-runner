/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {BasePrompt, IBlock, IFlowRunner, IRichCursorInputRequired, PromptValidationException} from '../index'

/**
 * Primary interface for interacting with an {@link IContact}; typically not immplemented fully, it is recommended that
 * additional {@link IPrompt} implementations rather extend provided {@link BasePrompt}.
 */
export interface IPrompt<PromptConfigType extends IPromptConfig<PromptConfigType['value']>> {
  interactionId: string
  config: PromptConfigType
  runner: IFlowRunner

  block?: IBlock
  value: PromptConfigType['value']
  /** Eror populated when {@link IPrompt.value} assignment raises  */
  error: PromptValidationException | null

  /** State populated when {@link IPrompt.value} is assigned */
  isValid(): boolean

  /** @see {@link BasePrompt.validate} */
  validate(val: PromptConfigType['value']): boolean

  /** @see {@link BasePrompt.fulfill} */
  fulfill(val: PromptConfigType['value']): Promise<IRichCursorInputRequired | undefined>
}

// todo: implement a pattern using Generics
//       via https://stackoverflow.com/questions/46025487/create-extendable-enums-for-use-in-extendable-interfaces

/** Interface for configuration to resolve and build a {@link BasePrompt} instance. */
export interface IPromptConfig<T> extends IBasePromptConfig {
  kind: string
  isResponseRequired: boolean
  prompt: string
  value?: T
}

/** Interface for local {@link BasePrompt} properties not intersecting with {@link IPromptConfig} */
export interface IBasePromptConfig {
  isSubmitted?: boolean
}

export interface PromptConstructor<T> {
  new (config: T, interactionId: string, runner: IFlowRunner): BasePrompt<any>
}
