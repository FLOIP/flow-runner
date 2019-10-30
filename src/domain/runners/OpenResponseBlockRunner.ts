import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import {IOpenPromptConfig, KnownPrompts} from '../..'
import IOpenResponseBlock from '../../model/block/IOpenResponseBlock'
import IContext from '../../flow-spec/IContext'
import IBlockInteraction from '../../flow-spec/IBlockInteraction'

export default class OpenResponseBlockRunner implements IBlockRunner {
  constructor(
    public block: IOpenResponseBlock,
    public context: IContext,
  ) {
  }

  initialize({value}: IBlockInteraction): IOpenPromptConfig {
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

      value: value as IOpenPromptConfig['value'],
    }
  }

  run(): IBlockExit {
    // todo: should there be a BaseBlockRunner that defaults to returning first exit?
    return this.block.exits[0]
  }
}