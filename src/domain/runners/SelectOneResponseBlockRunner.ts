import IBlockRunner from './IBlockRunner'
import {
  IBlockExitTestRequired,
  ISelectOnePromptConfig,
  KnownPrompts,
} from '../..'
import {findFirstTruthyEvaluatingBlockExitOn} from '../../flow-spec/IBlock'
import IBlockExit from '../../flow-spec/IBlockExit'
import ISelectOneResponseBlock from '../../model/block/ISelectOneResponseBlock'
import IContext from '../../flow-spec/IContext'
import {last} from 'lodash'
import IBlockInteraction from '../../flow-spec/IBlockInteraction'

export default class SelectOneResponseBlockRunner implements IBlockRunner {
  constructor(
    public block: ISelectOneResponseBlock,
    public context: IContext) {}

  initialize({value}: IBlockInteraction): ISelectOnePromptConfig {
    const {prompt, choices} = this.block.config

    return {
      kind: KnownPrompts.SelectOne,
      prompt,
      isResponseRequired: true,
      choices: Object.keys(choices)
        .map(key => ({
          key,
          value: choices[key],
        })),

      value: value as ISelectOnePromptConfig['value'],
    }
  }

  run(): IBlockExit {
    return findFirstTruthyEvaluatingBlockExitOn(this.block, this.context)
      ?? last(this.block.exits) as IBlockExitTestRequired
  }
}
