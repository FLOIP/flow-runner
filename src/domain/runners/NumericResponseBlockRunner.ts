import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import {INumericPromptConfig, KnownPrompts} from '../..'
import INumericResponseBlock from '../../model/block/INumericResponseBlock'
import IContext from '../../flow-spec/IContext'
import IBlockInteraction from '../../flow-spec/IBlockInteraction'

export class NumericResponseBlockRunner implements IBlockRunner {
  constructor(
    public block: INumericResponseBlock,
    public context: IContext) {}

  initialize({value}: IBlockInteraction): INumericPromptConfig {
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

      value: value as INumericPromptConfig['value'],
    }
  }

  run(): IBlockExit { // todo: what constitutes an error exit on web/android chanels?
    return this.block.exits[0]
  }
}

export default NumericResponseBlockRunner