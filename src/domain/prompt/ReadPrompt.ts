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

import {fill, isArray} from 'lodash'
import scanf from 'scanf'
import BasePrompt from './BasePrompt'
import {IBasePromptConfig} from './IPrompt'
import ValidationException from '../exceptions/ValidationException'
import {IReadPromptConfig, TReadableType} from './IReadPromptConfig'
import IFlowRunner from '../IFlowRunner'
import {PromptValidationException} from '../..'

export interface IConsolePrompt {
  read(): void,
}

/**
 * Concrete implementation of {@link BasePrompt} to request input using platform dependent readline utility from an
 * {@link IContact}.
 */
export class ReadPrompt
  extends BasePrompt<IReadPromptConfig & IBasePromptConfig>
  implements IConsolePrompt {

  constructor(
    public config: IReadPromptConfig & IBasePromptConfig,
    public interactionId: string,
    public runner: IFlowRunner,
    public console: Console = console) {

    super(config, interactionId, runner)
  }

  read(): void {
    try {
      this.console.log(this.config.prompt)
      const input: TReadableType | TReadableType[] = scanf(this.config.formatString)
      this.value = isArray(input) ? input : [input]
    } catch ({message}) {
      this.value = fill(new Array(this.config.destinationVariables.length), null) // default to null as empties
      this.error = new PromptValidationException(message)
    }
  }

  validate(readValues: IReadPromptConfig['value']): boolean {
    const {destinationVariables} = this.config

    if (readValues == null) {
      throw new ValidationException('Value provided must be a list of string|number')
    }

    if (readValues.length !== destinationVariables.length) {
      throw new ValidationException('Values provided must match length of destinationVariables')
    }

    return true
  }
}

export default ReadPrompt
