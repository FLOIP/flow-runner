/**
 * Flow Interoperability Project (flowinterop.org)
 * Flow Runner
 * Copyright (c) 2019, 2020 Viamo Inc.
 * Authored by: Brett Zabos (brett.zabos@viamo.io)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/

import PromptValidationException from '../exceptions/PromptValidationException'
import IFlowRunner from '../IFlowRunner'
import {IRichCursorInputRequired} from '../..'

/**
 * Primary interface for interacting with an {@link IContact}; typically not immplemented fully, it is recommended that
 * additional {@link IPrompt} implementations rather extend provided {@link BasePrompt}.
 */
export interface IPrompt<PromptConfigType extends IPromptConfig<PromptConfigType['value']> & IBasePromptConfig> {
  interactionId: string
  config: PromptConfigType
  runner: IFlowRunner

  value: PromptConfigType['value']
  /** Eror populated when {@link IPrompt.value} assignment raises  */
  error: PromptValidationException | null
  /** State populated when {@link IPrompt.value} is assigned */
  isValid: boolean // !this.error


  /** @see {@link BasePrompt.validate} */
  validate(val: PromptConfigType['value']): boolean
  /** @see {@link BasePrompt.fulfill} */
  fulfill(val: PromptConfigType['value']): IRichCursorInputRequired | undefined
}

export default IPrompt

// todo: implement a pattern using Generics
//       via https://stackoverflow.com/questions/46025487/create-extendable-enums-for-use-in-extendable-interfaces

/** Enumeration of pre-packaged Prompt kinds; contains string values. */
export enum KnownPrompts {
  Message = 'Message',
  Numeric = 'Numeric',
  SelectOne = 'SelectOne',
  SelectMany = 'SelectMany',
  Open = 'Open',
  Read = 'Read',
}

/** Interface for configuration to resolve and build a {@link BasePrompt} instance. */
export interface IPromptConfig<ExpectationType> {
  kind: keyof typeof KnownPrompts
  isResponseRequired: boolean
  prompt: string
  value?: ExpectationType
}

/** Interface for local {@link BasePrompt} properties not intersecting with {@link IPromptConfig} */
export interface IBasePromptConfig {
  isSubmitted: boolean
}