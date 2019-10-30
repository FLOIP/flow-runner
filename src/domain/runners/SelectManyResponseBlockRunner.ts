import IBlockRunner from './IBlockRunner'
import {
  findFirstTruthyEvaluatingBlockExitOn, IBlockExitTestRequired,
  KnownPrompts,
} from '../..'
import IBlockExit from '../../flow-spec/IBlockExit'
import ISelectOneResponseBlock from '../../model/block/ISelectOneResponseBlock'
import IContext from '../../flow-spec/IContext'
import ResourceResolver from '../ResourceResolver'
import IResourceResolver from '../IResourceResolver'
import {last} from 'lodash'
import {ISelectManyPromptConfig} from '../prompt/ISelectManyPromptConfig'

export default class SelectManyResponseBlockRunner implements IBlockRunner {
  constructor(public block: ISelectOneResponseBlock,
              public context: IContext) {
  }

  initialize(): ISelectManyPromptConfig {
    const {prompt, choices} = this.block.config
    const resources: IResourceResolver = new ResourceResolver(this.context)

    return {
      kind: KnownPrompts.SelectMany,
      prompt: resources.resolve(prompt),
      isResponseRequired: true,
      choices: Object.keys(choices)
        .map(key => ({
          key,
          value: resources.resolve(choices[key]),
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