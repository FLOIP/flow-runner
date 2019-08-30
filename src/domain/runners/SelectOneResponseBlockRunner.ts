import IBlockRunner from './IBlockRunner'
import {ISelectOnePromptConfig, KnownPrompts} from '../..'
import IBlockExit from '../../flow-spec/IBlockExit'
import ISelectOneResponseBlock from '../../model/block/ISelectOneResponseBlock'

export default class SelectOneResponseBlockRunner implements IBlockRunner {
  constructor(
    public block: ISelectOneResponseBlock) {
  }

  initialize(): ISelectOnePromptConfig {
    const {prompt, choices} = this.block.config

    // todo: for choices resource lookup, we'll want to detect uuid like:
    //       "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed".length === 36 && .test(/[\d\w]{8}-([\d\w]{4}-){3}[\d\w]{12}/i)

    return {
      kind: KnownPrompts.SelectOne,
      prompt,
      isResponseRequired: true,
      choices: Object.keys(choices)
        .map(key => ({key, value: choices[key]})),
    }
  }

  run(): IBlockExit {
    // todo: need to know how we provide selected value on a context to an expression evaluator here
    // const evaluator = EvaluatorFactory.create()
    // const result = evaluator.evaluate(expression, context)

    return this.block.exits[0]
  }
}