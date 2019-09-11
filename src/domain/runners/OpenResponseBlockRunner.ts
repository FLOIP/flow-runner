import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import {IOpenPromptConfig, KnownPrompts} from '../..'
import IOpenResponseBlock from '../../model/block/IOpenResponseBlock'
import ResourceResolver from '../ResourceResolver'
import IContext from '../../flow-spec/IContext'

export default class OpenResponseBlockRunner implements IBlockRunner {
  constructor(public block: IOpenResponseBlock,
              public context: IContext) {}

  initialize(): IOpenPromptConfig {
    const {
      prompt,
      text: {maxResponseCharacters}
    } = this.block.config

    return {
      kind: KnownPrompts.Open,
      prompt: (new ResourceResolver(this.context)).resolve(prompt),
      isResponseRequired: true,
      maxResponseCharacters,
    }
  }

  run(): IBlockExit {
    // todo: should there be a BaseBlockRunner that defaults to returning first exit?
    return this.block.exits[0]
  }
}