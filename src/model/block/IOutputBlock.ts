import IBlock from '../../flow-spec/IBlock'
import IOutputBlockConfig from './IOutputBlockConfig'

export default interface ILogBlock extends IBlock {
  config: IOutputBlockConfig
}