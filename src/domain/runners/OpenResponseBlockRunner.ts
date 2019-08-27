import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import {IOpenPromptConfig, KnownPrompts} from '../..'
import IOpenResponseBlock from '../../model/block/IOpenResponseBlock'

export default class OpenResponseBlockRunner implements IBlockRunner {
  constructor(
    public block: IOpenResponseBlock) {
  }

  initialize(): IOpenPromptConfig {
    return {
      kind: KnownPrompts.Open,
      prompt: this.block.config.prompt,
      isResponseRequired: true,
      maxResponseCharacters: this.block.config.text.maxResponseCharacters,
    }
  }

  run(): IBlockExit {
    // todo: should there be a BaseBlockRunner that defaults to returning first exit?
    return this.block.exits[0]
  }
}