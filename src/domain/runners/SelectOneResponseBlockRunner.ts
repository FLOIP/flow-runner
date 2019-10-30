import IBlockRunner from './IBlockRunner'
import {
  findFirstTruthyEvaluatingBlockExitOn, IBlockExitTestRequired,
  ISelectOnePromptConfig,
  KnownPrompts,
} from '../..'
import IBlockExit from '../../flow-spec/IBlockExit'
import ISelectOneResponseBlock from '../../model/block/ISelectOneResponseBlock'
import IContext from '../../flow-spec/IContext'
import {last} from 'lodash'

export default class SelectOneResponseBlockRunner implements IBlockRunner {
  constructor(public block: ISelectOneResponseBlock,
              public context: IContext) {
  }

  initialize(): ISelectOnePromptConfig {
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
    }
  }

  run(): IBlockExit {
    // todo: tdd this :P
    const truthyExit: IBlockExitTestRequired | undefined =
      findFirstTruthyEvaluatingBlockExitOn(this.block, this.context)

    return (truthyExit != null
      ? truthyExit
      : last(this.block.exits)) as IBlockExitTestRequired
  }
}