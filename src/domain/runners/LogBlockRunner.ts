import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import IContext from '../../flow-spec/IContext'
import ILogBlock from '../../model/block/ILogBlock'
import {evaluateToString} from '../..'
import createFormattedDate from '../DateFormat'


export class LogBlockRunner implements IBlockRunner {
  constructor(
    public block: ILogBlock,
    public context: IContext) {}

  initialize(): undefined {
    return
  }

  run(): IBlockExit {
    this.context.logs[createFormattedDate()] =
      evaluateToString(this.block.config.message, this.context)

    // todo: should we also write this as the value of the block interaction like the output block?

    return this.block.exits[0]
  }
}

export default LogBlockRunner