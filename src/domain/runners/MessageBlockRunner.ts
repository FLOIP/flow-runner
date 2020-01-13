import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import {IMessagePromptConfig, KnownPrompts} from '../..'
import IMessageBlock from '../../model/block/IMessageBlock'
import IContext from '../../flow-spec/IContext'


export class MessageBlockRunner implements IBlockRunner {
  constructor(
    public block: IMessageBlock,
    public context: IContext) {}

  initialize(): IMessagePromptConfig {
    const {prompt} = this.block.config
    return {
      kind: KnownPrompts.Message,
      prompt,
      isResponseRequired: false,
    }
  }

  run(): IBlockExit {
    return this.block.exits[0]
  }
}

export default MessageBlockRunner