import IBlock from '../../flow-spec/IBlock'
import IMessageBlockConfig from './IMessageBlockConfig'

export default interface IMessageBlock extends IBlock {
  config: IMessageBlockConfig
}
