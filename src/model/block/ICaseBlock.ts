import IBlock from '../../flow-spec/IBlock'
import ICaseBlockConfig from './ICaseBlockConfig'
import {IBlockExitTestRequired} from '../../flow-spec/IBlockExit'

export default interface ICaseBlock extends IBlock {
  config: ICaseBlockConfig,
  exits: IBlockExitTestRequired[],
}