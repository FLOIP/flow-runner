import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import IContext from '../../flow-spec/IContext'
import ILogBlock from '../../model/block/ILogBlock'
import {evaluateToString} from '../..'


export class LogBlockRunner implements IBlockRunner {
  constructor(
    public block: ILogBlock,
    public context: IContext) {}

  initialize(): undefined {
    return
  }

  run(): IBlockExit {
    // todo: should this be w/ T or w/o T ? See: https://floip.gitbooks.io/flow-specification/content/layers/layer1/blocks.html
    this.context.logs[(new Date).toISOString()] =
      evaluateToString(this.block.config.message, this.context)

    // todo: should we also write this as the value of the block interaction like the output block?

    return this.block.exits[0]
  }
}

export default LogBlockRunner