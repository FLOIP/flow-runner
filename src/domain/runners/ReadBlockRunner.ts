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

import {zipObject} from 'lodash'
import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import IContext, {TRichCursorInputRequired} from '../../flow-spec/IContext'
import IReadBlock from '../../model/block/IReadBlock'
import ReadPrompt from '../prompt/ReadPrompt'
import {IReadPromptConfig, TReadableType} from '../prompt/IReadPromptConfig'
import {KnownPrompts} from '../..'
import IReadBlockInteractionDetails from '../../flow-spec/IReadBlockInteractionDetails'


export class ReadBlockRunner implements IBlockRunner {
  constructor(
    public block: IReadBlock,
    public context: IContext) {}

  initialize(): IReadPromptConfig {
    const {destinationVariables, formatString} = this.block.config
    return {
      kind: KnownPrompts.Read,
      prompt: `Requesting  ${JSON.stringify(destinationVariables)}`,
      destinationVariables,
      formatString,
      isResponseRequired: false,
    }
  }

  run([interaction, prompt]: TRichCursorInputRequired): IBlockExit {
    interaction.value = zipObject(
      this.block.config.destinationVariables,
      (prompt as ReadPrompt).value as TReadableType[])

    const {error} = prompt
    if (error != null) {
      (interaction.details as IReadBlockInteractionDetails).readError = {message: error.message}
    }

    return prompt.isValid
      ? this.block.exits[0]
      : this.block.exits[1]
  }
}

export default ReadBlockRunner