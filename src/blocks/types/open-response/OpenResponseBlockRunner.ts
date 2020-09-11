/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {
  IBlockExit,
  IBlockInteraction,
  IBlockRunner,
  IContext,
  IOpenPromptConfig,
  IOpenResponseBlock,
  OPEN_PROMPT_KEY,
  setContactProperty,
} from '../../../index'

/**
 * Block runner for `MobilePrimitives\OpenResponse` - Obtains an open-ended response from the contact. Dependent on the
 * channel, this is a text response, audio recording, or other type of media recording (e.g. video).
 *
 * - text (SMS): Send an SMS with the prompt text, according to the prompt configuration in config above, and wait to
 *   capture a response. (Lack a response after the flow's configured timeout: proceed through the error exit.)
 * - text (USSD): Display a USSD menu prompt with the prompt text, according to the prompt configuration in config
 *   above, then wait to capture the menu response. (Dismissal of the session or timeout: proceed through the error
 *   exit.)
 * - ivr: Play the audio prompt, acccording to the prompt configuration in config above, then wait to capture the DTMF
 *   reponse. (Hangup or timeout with nothing recorded: proceed through the error exit.)
 * - rich_messaging: Display the prompt text according to the prompt configuration in config above, and wait to capture
 *   a text response or an upload (audio, video) from the contact. (Timeout: proceed through the error exit.)
 * - offline: Display the prompt text according to the prompt configuration in config above, and display a text entry
 *   widget. Wait to capture a response.
 */
export class OpenResponseBlockRunner implements IBlockRunner {
  constructor(public block: IOpenResponseBlock, public context: IContext) {}

  async initialize({value}: IBlockInteraction): Promise<IOpenPromptConfig> {
    const blockConfig = this.block.config

    let maxResponseCharacters
    if (blockConfig.text != null) {
      maxResponseCharacters = blockConfig.text.maxResponseCharacters
    }

    return {
      kind: OPEN_PROMPT_KEY,
      prompt: blockConfig.prompt,
      isResponseRequired: true,
      maxResponseCharacters: maxResponseCharacters,

      value: value as IOpenPromptConfig['value'],
    }
  }

  async run(): Promise<IBlockExit> {
    setContactProperty(this.block, this.context)
    // todo: should there be a BaseBlockRunner that defaults to returning first exit?
    return this.block.exits[0]
  }
}
