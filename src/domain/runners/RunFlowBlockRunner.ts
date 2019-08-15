import IBlockRunner from './IBlockRunner'
import IBlock from '../../flow-spec/IBlock'
import IBlockExit from '../../flow-spec/IBlockExit'
import IRunFlowBlockConfig from '../../model/block/IRunFlowBlockConfig'

export default class RunFlowBlockRunner implements IBlockRunner {
  constructor(
    public block: IBlock & { config: IRunFlowBlockConfig }) {
  }

  initialize(): undefined {
    return undefined
  }

  run(): IBlockExit {
    return this.block.exits[0]
  }
}
