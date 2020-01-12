import IBlock from '../../flow-spec/IBlock'
import IOutputBlockConfig from './IOutputBlockConfig'

export default interface IOutputBlock extends IBlock {
  config: IOutputBlockConfig
}