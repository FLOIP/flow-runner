import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import {INumericPromptConfig, KnownPrompts} from '../..'
import INumericResponseBlock from '../../model/block/INumericResponseBlock'
import IContext from '../../flow-spec/IContext'
import ResourceResolver from '../ResourceResolver'

export default class NumericResponseBlockRunner implements IBlockRunner {
  constructor(public block: INumericResponseBlock,
              public context: IContext) {}

  initialize(): INumericPromptConfig {
    const {
      prompt,
      validationMinimum: min,
      validationMaximum: max,
    } = this.block.config

    return {
      kind: KnownPrompts.Numeric,
      prompt: (new ResourceResolver(this.context)).resolve(prompt),
      isResponseRequired: false,

      min,
      max,
    }
  }

  run(): IBlockExit { // todo: what constitutes an error exit on web/android chanels?
    return this.block.exits[0]
  }
}