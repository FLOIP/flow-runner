import { IBlockExit, IBlockRunner, IContext, IMessageBlock, IMessagePromptConfig } from '../..';
export declare class MessageBlockRunner implements IBlockRunner {
    block: IMessageBlock;
    context: IContext;
    constructor(block: IMessageBlock, context: IContext);
    initialize(): Promise<IMessagePromptConfig>;
    run(): Promise<IBlockExit>;
}
//# sourceMappingURL=MessageBlockRunner.d.ts.map