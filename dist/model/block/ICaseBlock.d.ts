import IBlock from '../../flow-spec/IBlock';
import ICaseBlockConfig from './ICaseBlockConfig';
import { IBlockExitTestRequired } from '../../flow-spec/IBlockExit';
export interface ICaseBlock extends IBlock {
    config: ICaseBlockConfig;
    exits: IBlockExitTestRequired[];
}
export default ICaseBlock;
//# sourceMappingURL=ICaseBlock.d.ts.map