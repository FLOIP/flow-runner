import IBlock from '../../flow-spec/IBlock'
import IRunFlowBlockConfig from './IRunFlowBlockConfig'

export default interface IRunFlowBlock extends IBlock {
  config: IRunFlowBlockConfig,
}