import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import {IMessagePromptConfig, KnownPrompts} from '../..'
import IMessageBlock from '../../model/block/IMessageBlock'
import IResourceResolver from '../IResourceResolver'


export default class MessageBlockRunner implements IBlockRunner {
  constructor(public block: IMessageBlock,
              public resources: IResourceResolver) {}

  initialize(): IMessagePromptConfig {
    const {prompt} = this.block.config
    return {
      kind: KnownPrompts.Message,
      prompt: this.resources.resolve(prompt),
      isResponseRequired: false,
    }
  }

  run(): IBlockExit {
    return this.block.exits[0]
  }
}