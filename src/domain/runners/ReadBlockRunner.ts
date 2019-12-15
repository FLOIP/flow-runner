import scanf from 'scanf'
import IBlockRunner from './IBlockRunner'
import IBlockExit from '../../flow-spec/IBlockExit'
import IContext from '../../flow-spec/IContext'
import IReadBlock from '../../model/block/IReadBlock'


export default class PrintBlockRunner implements IBlockRunner {
  constructor(
    public block: IReadBlock,
    public context: IContext,
    public console: Console = console) {}

  initialize(): undefined {
    return
  }

  run(): IBlockExit {
    try {
      // todo: how are these to be referenced via context later in the flow?
      this.context.destination_variables = scanf(this.block.config.formatString)

      // todo: should we also write this as the value of the block interaction like the output block?
      return this.block.exits[0]

    } catch (e) {
      return this.block.exits[1]
    }
  }
}