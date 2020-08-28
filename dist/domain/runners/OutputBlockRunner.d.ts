import { IBlockExit, IBlockRunner, IContext, IOutputBlock, IRichCursor } from '../..';
export declare class OutputBlockRunner implements IBlockRunner {
    block: IOutputBlock;
    context: IContext;
    constructor(block: IOutputBlock, context: IContext);
    initialize(): Promise<undefined>;
    run(cursor: IRichCursor): Promise<IBlockExit>;
}
//# sourceMappingURL=OutputBlockRunner.d.ts.map