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
import IBlockInteraction from '../../flow-spec/IBlockInteraction'

export default class SelectManyResponseBlockRunner implements IBlockRunner {
  constructor(public block: ISelectOneResponseBlock,
              public context: IContext) {
  }

  initialize({value}: IBlockInteraction): ISelectManyPromptConfig {
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

      value: value as ISelectManyPromptConfig['value'],
    }
  }

  run(): IBlockExit {
    return findFirstTruthyEvaluatingBlockExitOn(this.block, this.context)
      ?? last(this.block.exits) as IBlockExitTestRequired
  }
}