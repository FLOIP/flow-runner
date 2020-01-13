import IBlock from '../../flow-spec/IBlock'
import IMessageBlockConfig from './IMessageBlockConfig'

export interface IMessageBlock extends IBlock {
  config: IMessageBlockConfig,
}

export default IMessageBlock