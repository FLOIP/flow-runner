import {IBlockWithTestExits} from '../../flow-spec/IBlock'
import ISelectOneResponseBlockConfig from './ISelectOneResponseBlockConfig'

// todo: currently we don't perform any other behaviour than test evaluation on SelectOne
export default interface ISelectOneResponseBlock extends IBlockWithTestExits {
  config: ISelectOneResponseBlockConfig,
}