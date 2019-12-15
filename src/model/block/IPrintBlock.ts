import IBlock from '../../flow-spec/IBlock'
import IPrintBlockConfig from './IPrintBlockConfig'

export default interface IPrintBlock extends IBlock {
  config: IPrintBlockConfig
}