import BasePrompt from './BasePrompt'
import {IBasePromptConfig} from './IPrompt'
import {IMessagePromptConfig} from './IMessagePromptConfig'

export class MessagePrompt extends BasePrompt<IMessagePromptConfig & IBasePromptConfig> {
  validate() {
    return true
  }
}

export default MessagePrompt