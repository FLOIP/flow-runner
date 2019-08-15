import IBlockRunner from './IBlockRunner'
import IBlock from '../../flow-spec/IBlock'
import {ISelectOnePromptConfig} from '../prompt/ISelectOnePromptConfig'
import IBlockExit from '../../flow-spec/IBlockExit'
import ISelectOneResponseBlockConfig from '../../model/block/ISelectOneResponseBlockConfig'
import {KnownPrompts} from '../prompt/IPrompt'

export default class SelectOneResponseBlockRunner implements IBlockRunner {
  constructor(
    public block: IBlock & { config: ISelectOneResponseBlockConfig }) {
  }

  initialize(): ISelectOnePromptConfig {
    return {
      kind: KnownPrompts.SelectOne,
      choices: Array.from(this.block.config.choices.keys()),
      isResponseRequired: true,
      value: null,
    }
  }

  run(): IBlockExit {
    // todo: need to know how we provide selected value on a context to an expression evaluator here
    return this.block.exits[0]
  }
}