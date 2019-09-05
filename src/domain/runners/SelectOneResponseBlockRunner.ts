import IBlockRunner from './IBlockRunner'
import {ISelectOnePromptConfig, KnownPrompts} from '../..'
import IBlockExit from '../../flow-spec/IBlockExit'
import ISelectOneResponseBlock from '../../model/block/ISelectOneResponseBlock'
import IResourceResolver from '../IResourceResolver'

export default class SelectOneResponseBlockRunner implements IBlockRunner {
  constructor(public block: ISelectOneResponseBlock,
              public resources: IResourceResolver) {
  }

  initialize(): ISelectOnePromptConfig {
    const {prompt, choices} = this.block.config

    return {
      kind: KnownPrompts.SelectOne,
      prompt: this.resources.resolve(prompt),
      isResponseRequired: true,
      choices: Object.keys(choices)
        .map(key => ({
          key,
          value: this.resources.resolve(choices[key]),
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