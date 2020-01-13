import IBlockRunner from './IBlockRunner'
import IBlock from '../../flow-spec/IBlock'
import IBlockExit from '../../flow-spec/IBlockExit'
import IRunFlowBlockConfig from '../../model/block/IRunFlowBlockConfig'
import IContext from '../../flow-spec/IContext'

export class RunFlowBlockRunner implements IBlockRunner {
  constructor(
    public block: IBlock & { config: IRunFlowBlockConfig },
    public context: IContext) {}

  initialize(): undefined {
    return undefined
  }

  run(): IBlockExit {
    return this.block.exits[0]
  }
}

export default RunFlowBlockRunner