import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import {IMessagePromptConfig, KnownPrompts} from '../..'
import IMessageBlock from '../../model/block/IMessageBlock'


export default class MessageBlockRunner implements IBlockRunner {
  constructor(public block: IMessageBlock) {
  }

  initialize(): IMessagePromptConfig {
    return {
      kind: KnownPrompts.Message,
      prompt: this.block.config.prompt,
      isResponseRequired: false,
    }
  }

  run(): IBlockExit {
    return this.block.exits[0]
  }
}