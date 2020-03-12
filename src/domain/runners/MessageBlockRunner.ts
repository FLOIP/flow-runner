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
import {IMessagePromptConfig, KnownPrompts} from '../..'
import IMessageBlock from '../../model/block/IMessageBlock'
import IContext from '../../flow-spec/IContext'


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
  constructor(
    public block: IMessageBlock,
    public context: IContext) {}

  async initialize(): Promise<IMessagePromptConfig> {
    const {prompt} = this.block.config
    return {
      kind: KnownPrompts.Message,
      prompt,
      isResponseRequired: false,
    }
  }

  async run(): Promise<IBlockExit> {
    return this.block.exits[0]
  }
}

export default MessageBlockRunner
