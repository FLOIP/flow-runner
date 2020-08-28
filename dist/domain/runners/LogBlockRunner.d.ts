import { IBlockExit, IBlockRunner, IContext, ILogBlock } from '../..';
export declare class LogBlockRunner implements IBlockRunner {
    block: ILogBlock;
    context: IContext;
    constructor(block: ILogBlock, context: IContext);
    initialize(): Promise<undefined>;
    run(): Promise<IBlockExit>;
}
//# sourceMappingURL=LogBlockRunner.d.ts.map