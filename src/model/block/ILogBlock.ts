import IBlock from '../../flow-spec/IBlock'
import ILogBlockConfig from './ILogBlockConfig'

export interface ILogBlock extends IBlock {
  config: ILogBlockConfig
}

export default ILogBlock