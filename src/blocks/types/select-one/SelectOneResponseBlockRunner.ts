/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {
  findFirstTruthyEvaluatingBlockExitOn,
  IBlockExit,
  IBlockExitTestRequired,
  IBlockInteraction,
  IBlockRunner,
  IContext,
  ISelectOnePromptConfig,
  ISelectOneResponseBlock,
  SELECT_ONE_PROMPT_KEY,
  setContactProperty,
} from '../../../index'
import {last} from 'lodash'

/**
 * Block runner for `MobilePrimitives\SelectOneResponse` - Obtains the answer to a Multiple Choice question from the
 * contact. The contact must choose a single choice from a set of choices.
 *
 * - text (SMS): Send an SMS with the prompt text, according to the prompt configuration in config above, and wait to
 *   capture a response. (Lack a response after the flow's configured timeout, or an invalid response: proceed through
 *   the error exit.)
 * - text (USSD): Display a USSD menu prompt with the prompt text, according to the prompt configuration in config
 *   above, then wait to capture the menu response. (Dismissal of the session, timeout, or invalid response: proceed
 *   through the error exit.)
 * - ivr: Play the audio prompt, according to the prompt configuration in config above, then wait to capture the DTMF
 *   response. (Hangup, timeout, or invalid response: proceed through the error exit.)
 * - rich_messaging: Display the prompt text according to the prompt configuration in config above. Platforms may wait
 *   to capture a text response, or display rich menu items for each choice and wait to capture a menu choice.
 *   (If displaying menu items, platforms should display only question_prompt.) (Timeout or invalid response: proceed
 *   through the error exit.)
 * - offline: Display the prompt text according to question_prompt, and a menu of items for all choices. Wait to capture
 *   a menu selection.
 */
export class SelectOneResponseBlockRunner implements IBlockRunner {
  constructor(public block: ISelectOneResponseBlock, public context: IContext) {}

  async initialize({value}: IBlockInteraction): Promise<ISelectOnePromptConfig> {
    const {prompt, choices} = this.block.config

    return {
      kind: SELECT_ONE_PROMPT_KEY,
      prompt,
      isResponseRequired: true,
      choices: Object.keys(choices).map(key => ({
        key,
        value: choices[key],
      })),

      value: value as ISelectOnePromptConfig['value'],
    }
  }

  async run(): Promise<IBlockExit> {
    setContactProperty(this.block, this.context)
    return findFirstTruthyEvaluatingBlockExitOn(this.block, this.context) ?? (last(this.block.exits) as IBlockExitTestRequired)
  }
}
