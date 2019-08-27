import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import {INumericPromptConfig, KnownPrompts} from '../..'
import INumericResponseBlock from '../../model/block/INumericResponseBlock'

export default class NumericResponseBlockRunner implements IBlockRunner {
  constructor(
    public block: INumericResponseBlock) {
  }


  initialize(): INumericPromptConfig {
    const {
      prompt,
      validationMinimum: min,
      validationMaximum: max,
    } = this.block.config

    return {
      kind: KnownPrompts.Numeric,
      prompt,
      isResponseRequired: false,

      min,
      max,
    }
  }

  run(): IBlockExit { // todo: what constitutes an error exit on web/android chanels?
    return this.block.exits[0]
  }
}