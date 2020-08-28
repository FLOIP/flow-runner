import { IBlockExit, IBlockInteraction, IBlockRunner, IContext, INumericPromptConfig, INumericResponseBlock } from '../..';
export declare class NumericResponseBlockRunner implements IBlockRunner {
    block: INumericResponseBlock;
    context: IContext;
    constructor(block: INumericResponseBlock, context: IContext);
    initialize({ value }: IBlockInteraction): Promise<INumericPromptConfig>;
    run(): Promise<IBlockExit>;
}
//# sourceMappingURL=NumericResponseBlockRunner.d.ts.map