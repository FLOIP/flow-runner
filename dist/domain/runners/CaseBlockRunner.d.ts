import { IBlockExit, IBlockRunner, ICaseBlock, IContext } from '../..';
export declare class CaseBlockRunner implements IBlockRunner {
    block: ICaseBlock;
    context: IContext;
    constructor(block: ICaseBlock, context: IContext);
    initialize(): Promise<undefined>;
    run(): Promise<IBlockExit>;
}
//# sourceMappingURL=CaseBlockRunner.d.ts.map