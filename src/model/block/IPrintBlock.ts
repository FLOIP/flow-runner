import IBlock from '../../flow-spec/IBlock'
import IPrintBlockConfig from './IPrintBlockConfig'

export interface IPrintBlock extends IBlock {
  config: IPrintBlockConfig
}

export default IPrintBlock