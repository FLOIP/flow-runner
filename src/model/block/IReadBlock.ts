import IBlock from '../../flow-spec/IBlock'
import IReadBlockConfig from './IReadBlockConfig'

export default interface IReadBlock extends IBlock {
  config: IReadBlockConfig
}