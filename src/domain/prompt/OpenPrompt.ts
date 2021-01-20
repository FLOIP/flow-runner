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

import {BasePrompt, IOpenPromptConfig, PromptValidationException} from '../..'

export const OPEN_PROMPT_KEY = 'Open'

/**
 * Concrete implementation of {@link BasePrompt} to request a string of text, optionally with a maximum length boundary,
 * from an {@link IContact}.
 */
export class OpenPrompt extends BasePrompt<IOpenPromptConfig> {
  validateOrThrow(val: IOpenPromptConfig['value']): void {
    if (val == null) {
      throw new PromptValidationException('Value provided is null, undefined, or not a number')
    }

    const {maxResponseCharacters: maxLength} = this.config

    if (maxLength != null && val.length > maxLength) {
      // todo: add ability to provide validation codes to ValidationException for use as comparator in consumers
      // todo: need a method to define resources frontend needs from backend
      throw new PromptValidationException('Too many characters on value provided')
    }

    return
  }
}
