import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import IContext, { IRichCursor } from '../../flow-spec/IContext';
import IOutputBlock from '../../model/block/IOutputBlock';
export declare class OutputBlockRunner implements IBlockRunner {
    block: IOutputBlock;
    context: IContext;
    constructor(block: IOutputBlock, context: IContext);
    initialize(): undefined;
    run(cursor: IRichCursor): IBlockExit;
}
export default OutputBlockRunner;
//# sourceMappingURL=OutputBlockRunner.d.ts.map