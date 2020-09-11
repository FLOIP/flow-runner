/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IBlockExit, IBlockRunner, IContext, IMessageBlock, IMessagePromptConfig, MESSAGE_PROMPT_KEY} from '../../..'

/**
 * Block runner for `MobilePrimitives\Message` - Presents a single message to the contact. The form of the message can
 * depend on the channel: e.g. a voice recording for the ivr channel, and text for the text channel.
 *
 * - text (SMS): Sends message as an SMS to the contact.
 * - text (USSD): Displays message as the next USSD prompt to the user. (Note on USSD session management: If there are
 *   following blocks in the flow, the user has an opportunity to reply with anything to proceed. If there are no
 *   following blocks, the contact is prompted to dismiss the session.)
 * - ivr: Plays message-audio to the contact.
 * - rich_messaging: Display message within the conversation with the contact. Optionally, platforms may attach the
 *   message-prompt (if provided) as an audio attachment that the contact can choose to play.
 * - offline: Display message within the session with the contact.
 */
export class MessageBlockRunner implements IBlockRunner {
  constructor(public block: IMessageBlock, public context: IContext) {}

  async initialize(): Promise<IMessagePromptConfig> {
    const {prompt} = this.block.config
    return {
      kind: MESSAGE_PROMPT_KEY,
      prompt,
      isResponseRequired: false,
    }
  }

  async run(): Promise<IBlockExit> {
    return this.block.exits[0]
  }
}
