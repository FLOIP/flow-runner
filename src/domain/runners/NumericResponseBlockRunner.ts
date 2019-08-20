import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import {INumericPromptConfig} from '../prompt/INumericPromptConfig'
import IBlock from '../../flow-spec/IBlock'
import INumericBlockConfig from '../../model/block/INumericBlockConfig'
import {KnownPrompts} from '../prompt/IPrompt'

export default class NumericResponseBlockRunner implements IBlockRunner {
  constructor(
    public block: IBlock & { config: INumericBlockConfig }) {
  }


  initialize(): INumericPromptConfig {
    return {
      kind: KnownPrompts.Numeric,
      maxLength: 0, // todo: is this viamo-specific and no longer necessary?
      min: this.block.config.validationMinimum,
      max: this.block.config.validationMaximum,
      isResponseRequired: false,
      prompt: this.block.config.prompt,
    }
  }

  run(): IBlockExit {
    // todo: what constitutes an error exit on web/android chanels?

    return this.block.exits[0]
  }
}
