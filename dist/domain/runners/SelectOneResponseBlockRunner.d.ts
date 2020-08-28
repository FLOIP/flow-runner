import { IBlockExit, IBlockInteraction, IBlockRunner, IContext, ISelectOnePromptConfig, ISelectOneResponseBlock } from '../..';
export declare class SelectOneResponseBlockRunner implements IBlockRunner {
    block: ISelectOneResponseBlock;
    context: IContext;
    constructor(block: ISelectOneResponseBlock, context: IContext);
    initialize({ value }: IBlockInteraction): Promise<ISelectOnePromptConfig>;
    run(): Promise<IBlockExit>;
}
//# sourceMappingURL=SelectOneResponseBlockRunner.d.ts.map