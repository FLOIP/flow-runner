import IBlockRunner from './IBlockRunner'
import {ISelectOnePromptConfig, KnownPrompts} from '../..'
import IBlockExit from '../../flow-spec/IBlockExit'
import ISelectOneResponseBlock from '../../model/block/ISelectOneResponseBlock'
import IContext from '../../flow-spec/IContext'
import ResourceResolver from '../ResourceResolver'
import IResourceResolver from '../IResourceResolver'
import {find, last, pick} from 'lodash'
import {EvaluatorFactory} from 'floip-expression-evaluator-ts'
import ValidationException from '../exceptions/ValidationException'

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
    // todo: tdd this :P

    const {exits} = this.block
    if (exits.length === 0) {
      throw new ValidationException(`Unable to find exits on block ${this.block.uuid}`)
    }

    const {cursor} = this.context
    if (cursor == null || cursor[1] == null) {
      throw new ValidationException(`Unable to find cursor on context ${this.context.id}`)
    }

    const evaluator = EvaluatorFactory.create()
    const evalContext = {
      ...pick(this.context, ['contact']),
      value: cursor[1].value,
    }

    const exit = find(
      this.block.exits,
      ({test}) => Boolean(evaluator.evaluate(String(test), evalContext)))

    return (exit != null ? exit : last(exits)) as IBlockExit
  }
}