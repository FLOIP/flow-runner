import IBlockRunner from './IBlockRunner'
import IBlock from '../../flow-spec/IBlock'
import IBlockExit from '../../flow-spec/IBlockExit'
import {IOpenPromptConfig} from '../prompt/IOpenPromptConfig'
import IOpenResponseBlockConfig from '../../model/block/IOpenResponseBlockConfig'
import {KnownPrompts} from '../prompt/IPrompt'

export default class OpenResponseBlockRunner implements IBlockRunner {
  constructor(
    public block: IBlock & { config: IOpenResponseBlockConfig }) {
  }

  initialize(): IOpenPromptConfig {
    return {
      kind: KnownPrompts.Open,
      isResponseRequired: true,
      prompt: this.block.config.prompt,
    }
  }

  run(): IBlockExit {
    // todo: should there be a BaseBlockRunner that defaults to returning first exit?
    return this.block.exits[0]
  }
}