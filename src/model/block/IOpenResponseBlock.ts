import IBlock from '../../flow-spec/IBlock'
import IOpenResponseBlockConfig from './IOpenResponseBlockConfig'

export default interface IOpenResponseBlock extends IBlock {
  config: IOpenResponseBlockConfig,
}