import IBlockRunner from './IBlockRunner';
import { IBlockExitTestRequired } from '../..';
import IContext from '../../flow-spec/IContext';
import ICaseBlock from '../../model/block/ICaseBlock';
export declare class CaseBlockRunner implements IBlockRunner {
    block: ICaseBlock;
    context: IContext;
    constructor(block: ICaseBlock, context: IContext);
    initialize(): undefined;
    run(): IBlockExitTestRequired;
}
export default CaseBlockRunner;
//# sourceMappingURL=CaseBlockRunner.d.ts.map