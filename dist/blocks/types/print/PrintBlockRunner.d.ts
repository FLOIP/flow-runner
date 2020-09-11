/// <reference types="node" />
import { IBlockExit, IBlockRunner, IContext, IPrintBlock } from '../../../index';
export declare class PrintBlockRunner implements IBlockRunner {
    block: IPrintBlock;
    context: IContext;
    console: Console;
    constructor(block: IPrintBlock, context: IContext, console?: Console);
    initialize(): Promise<undefined>;
    run(): Promise<IBlockExit>;
}
//# sourceMappingURL=PrintBlockRunner.d.ts.map