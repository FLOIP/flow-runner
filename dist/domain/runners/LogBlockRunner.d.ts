import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import IContext from '../../flow-spec/IContext';
import ILogBlock from '../../model/block/ILogBlock';
export declare class LogBlockRunner implements IBlockRunner {
    block: ILogBlock;
    context: IContext;
    constructor(block: ILogBlock, context: IContext);
    initialize(): Promise<undefined>;
    run(): Promise<IBlockExit>;
}
export default LogBlockRunner;
//# sourceMappingURL=LogBlockRunner.d.ts.map