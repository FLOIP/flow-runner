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

import {
  DIRECTORY_SELECTION_PROMPT_KEY,
  findFirstTruthyEvaluatingBlockExitOn,
  IBlockExit,
  IBlockExitTestRequired,
  IBlockInteraction,
  IBlockRunner,
  IContext,
  IDirectorySelectionBlock,
  IDirectorySelectionBlockConfig,
  IDirectorySelectionPromptConfig,
  setContactProperty,
} from '../..'
import {last} from 'lodash'

export class DirectorySelectionBlockRunner implements IBlockRunner {
  constructor(public block: IDirectorySelectionBlock, public context: IContext) {}

  async initialize({value}: IBlockInteraction): Promise<IDirectorySelectionBlockConfig> {
    const {prompt, promptAudio, primaryField, secondaryFields, choiceRowFields, choiceRows, responseFields} = this.block.config

    return {
      kind: DIRECTORY_SELECTION_PROMPT_KEY,
      prompt,
      promptAudio,
      primaryField,
      secondaryFields,
      choiceRowFields,
      choiceRows,
      responseFields,
      isResponseRequired: true,

      value: value as IDirectorySelectionPromptConfig['value'],
    }
  }

  async run(): Promise<IBlockExit> {
    setContactProperty(this.block, this.context)
    return findFirstTruthyEvaluatingBlockExitOn(this.block, this.context) ?? (last(this.block.exits) as IBlockExitTestRequired)
  }
}
