import IBlock from '../../flow-spec/IBlock'
import IRunFlowBlockConfig from './IRunFlowBlockConfig'

export interface IRunFlowBlock extends IBlock {
  config: IRunFlowBlockConfig,
}

export default IRunFlowBlock