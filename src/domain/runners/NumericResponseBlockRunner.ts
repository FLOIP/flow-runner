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

import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import {INumericPromptConfig, KnownPrompts} from '../..'
import INumericResponseBlock from '../../model/block/INumericResponseBlock'
import IContext from '../../flow-spec/IContext'
import IBlockInteraction from '../../flow-spec/IBlockInteraction'

/**
 * Block runner for `MobilePrimitives\NumericResponse` - Obtains a numeric response from the contact.
 *
 * - text (SMS): Send an SMS with the prompt text, according to the prompt configuration in config above, and wait to
 *   capture a response. (Lack a response after the flow's configured timeout, or an invalid response: proceed through
 *   the error exit.)
 * - text (USSD): Display a USSD menu prompt with the prompt text, according to the prompt configuration in config
 *   above, then wait to capture the menu response. (Dismissal of the session, timeout, or invalid response: proceed
 *   through the error exit.)
 * - ivr: Play the audio prompt, acccording to the prompt configuration in config above, then wait to capture the DTMF
 *   reponse. (Hangup, timeout, or invalid response: proceed through the error exit.)
 * - rich_messaging: Display the prompt text according to the prompt configuration in config above. Platforms may wait
 *   to capture a text response, or display a numeric entry widget and wait to capture a response. (Timeout or invalid
 *   response: proceed through the error exit.)
 * - offline: Display the prompt text according to the prompt configuration in config above, and display a numeric entry
 *   widget. Wait to capture a response.
 */
export class NumericResponseBlockRunner implements IBlockRunner {
  constructor(
    public block: INumericResponseBlock,
    public context: IContext) {}

  initialize({value}: IBlockInteraction): INumericPromptConfig {
    const {
      prompt,
      validationMinimum: min,
      validationMaximum: max,
    } = this.block.config

    return {
      kind: KnownPrompts.Numeric,
      prompt,
      isResponseRequired: false,

      min,
      max,

      value: value as INumericPromptConfig['value'],
    }
  }

  run(): IBlockExit { // todo: what constitutes an error exit on web/android chanels?
    return this.block.exits[0]
  }
}

export default NumericResponseBlockRunner