import IBlock from '../../flow-spec/IBlock'
import ILogBlockConfig from './ILogBlockConfig'

export default interface ILogBlock extends IBlock {
  config: ILogBlockConfig
}