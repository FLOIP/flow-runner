import {IBlockWithTestExits} from '../../flow-spec/IBlock'
import ISelectOneResponseBlockConfig from './ISelectOneResponseBlockConfig'

// todo: currently we don't perform any other behaviour than test evaluation on SelectOne
export interface ISelectOneResponseBlock extends IBlockWithTestExits {
  config: ISelectOneResponseBlockConfig,
}

export default ISelectOneResponseBlock