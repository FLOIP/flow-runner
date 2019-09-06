import IBlockRunner from './IBlockRunner'
import {ISelectOnePromptConfig, KnownPrompts} from '../..'
import IBlockExit from '../../flow-spec/IBlockExit'
import ISelectOneResponseBlock from '../../model/block/ISelectOneResponseBlock'
import IContext from '../../flow-spec/IContext'
import ResourceResolver from '../ResourceResolver'
import IResourceResolver from '../IResourceResolver'

export default class SelectOneResponseBlockRunner implements IBlockRunner {
  constructor(public block: ISelectOneResponseBlock,
              public context: IContext) {
  }

  initialize(): ISelectOnePromptConfig {
    const {prompt, choices} = this.block.config
    const resources: IResourceResolver = new ResourceResolver(this.context)

    return {
      kind: KnownPrompts.SelectOne,
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
    // todo: need to know how we provide selected value on a context to an expression evaluator here
    // const evaluator = EvaluatorFactory.create()
    // const result = evaluator.evaluate(expression, context)

    return this.block.exits[0]
  }
}