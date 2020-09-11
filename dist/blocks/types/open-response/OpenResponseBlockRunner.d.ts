import { IBlockExit, IBlockInteraction, IBlockRunner, IContext, IOpenPromptConfig, IOpenResponseBlock } from '../../../index';
export declare class OpenResponseBlockRunner implements IBlockRunner {
    block: IOpenResponseBlock;
    context: IContext;
    constructor(block: IOpenResponseBlock, context: IContext);
    initialize({ value }: IBlockInteraction): Promise<IOpenPromptConfig>;
    run(): Promise<IBlockExit>;
}
//# sourceMappingURL=OpenResponseBlockRunner.d.ts.map