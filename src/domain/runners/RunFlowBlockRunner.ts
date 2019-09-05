import IBlockRunner from './IBlockRunner'
import IBlock from '../../flow-spec/IBlock'
import IBlockExit from '../../flow-spec/IBlockExit'
import IRunFlowBlockConfig from '../../model/block/IRunFlowBlockConfig'
import IResourceResolver from '../IResourceResolver'

export default class RunFlowBlockRunner implements IBlockRunner {
  constructor(public block: IBlock & { config: IRunFlowBlockConfig },
              public resources: IResourceResolver) {}

  initialize(): undefined {
    return undefined
  }

  run(): IBlockExit {
    return this.block.exits[0]
  }
}
