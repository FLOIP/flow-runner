import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import IContext from '../../flow-spec/IContext'
import {evaluateToString} from '../..'
import IPrintBlock from '../../model/block/IPrintBlock'


export default class PrintBlockRunner implements IBlockRunner {
  constructor(
    public block: IPrintBlock,
    public context: IContext,
    public console: Console = console) {}

  initialize(): undefined {
    return
  }

  run(): IBlockExit {
    this.console.log(
      this.block.type,
      evaluateToString(this.block.config.message, this.context))

    // todo: should we also write this as the value of the block interaction like the output block?
    return this.block.exits[0]
  }
}