import IBlock from '../../flow-spec/IBlock'
import ISelectOneResponseBlockConfig from './ISelectOneResponseBlockConfig'

export default interface ISelectOneResponseBlock extends IBlock {
  config: ISelectOneResponseBlockConfig,
}