import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import {IMessagePromptConfig} from '../prompt/IMessagePromptConfig'
import {KnownPrompts} from '../prompt/IPrompt'
import IMessageBlock from '../../model/block/IMessageBlock'


export default class MessageBlockRunner implements IBlockRunner {
  constructor(public block: IMessageBlock) {
  }

  initialize(): IMessagePromptConfig {
    return {
      kind: KnownPrompts.Message,
      isResponseRequired: false,
    }
  }

  run(): IBlockExit {
    return this.block.exits[0]
  }
}