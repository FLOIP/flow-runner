import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import {IOpenPromptConfig, KnownPrompts} from '../..'
import IOpenResponseBlock from '../../model/block/IOpenResponseBlock'
import IContext from '../../flow-spec/IContext'

export default class OpenResponseBlockRunner implements IBlockRunner {
  constructor(
    public block: IOpenResponseBlock,
    public context: IContext,
  ) {
  }

  initialize(): IOpenPromptConfig {
    const blockConfig = this.block.config

    let maxResponseCharacters
    if (blockConfig.text != null) {
      maxResponseCharacters = blockConfig.text.maxResponseCharacters
    }

    return {
      kind: KnownPrompts.Open,
      prompt: blockConfig.prompt,
      isResponseRequired: true,
      maxResponseCharacters: maxResponseCharacters,
    }
  }

  run(): IBlockExit {
    // todo: should there be a BaseBlockRunner that defaults to returning first exit?
    return this.block.exits[0]
  }
}