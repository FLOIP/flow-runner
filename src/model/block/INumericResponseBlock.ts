import IBlock from '../../flow-spec/IBlock'
import INumericBlockConfig from './INumericBlockConfig'

export default interface INumericResponseBlock extends IBlock {
  config: INumericBlockConfig,
}