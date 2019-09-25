import IBlockRunner from './IBlockRunner'
import {
  findFirstTruthyEvaluatingBlockExitOn, IBlockExitTestRequired,
  KnownPrompts,
} from '../..'
import IBlockExit from '../../flow-spec/IBlockExit'
import ISelectOneResponseBlock from '../../model/block/ISelectOneResponseBlock'
import IContext from '../../flow-spec/IContext'
import {last} from 'lodash'
import {ISelectManyPromptConfig} from '../prompt/ISelectManyPromptConfig'

export default class SelectManyResponseBlockRunner implements IBlockRunner {
  constructor(public block: ISelectOneResponseBlock,
              public context: IContext) {
  }

  initialize(): ISelectManyPromptConfig {
    const {prompt, choices} = this.block.config

    return {
      kind: KnownPrompts.SelectMany,
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