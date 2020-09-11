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
  INumericPromptConfig,
  INumericResponseBlock,
  NUMERIC_PROMPT_KEY,
  setContactProperty,
} from '../../../index'

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
  constructor(public block: INumericResponseBlock, public context: IContext) {}

  async initialize({value}: IBlockInteraction): Promise<INumericPromptConfig> {
    const {prompt, validationMinimum: min, validationMaximum: max} = this.block.config

    return {
      kind: NUMERIC_PROMPT_KEY,
      prompt,
      isResponseRequired: false,

      min,
      max,

      value: value as INumericPromptConfig['value'],
    }
  }

  async run(): Promise<IBlockExit> {
    setContactProperty(this.block, this.context)
    // todo: what constitutes an error exit on web/android chanels?
    return this.block.exits[0]
  }
}
