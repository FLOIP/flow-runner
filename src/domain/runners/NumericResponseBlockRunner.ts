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
    const {
      validationMinimum: min,
      validationMaximum: max,
    } = this.block.config

    return {
      kind: KnownPrompts.Numeric,
      prompt: this.block.config.prompt,
      isResponseRequired: false,

      min,
      max,
    }
  }

  run(): IBlockExit { // todo: what constitutes an error exit on web/android chanels?
    return this.block.exits[0]
  }
}
