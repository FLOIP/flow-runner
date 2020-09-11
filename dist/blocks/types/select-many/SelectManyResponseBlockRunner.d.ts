import { IBlockExit, IBlockInteraction, IBlockRunner, IContext, ISelectManyPromptConfig, ISelectOneResponseBlock } from '../../../index';
export declare class SelectManyResponseBlockRunner implements IBlockRunner {
    block: ISelectOneResponseBlock;
    context: IContext;
    constructor(block: ISelectOneResponseBlock, context: IContext);
    initialize({ value }: IBlockInteraction): Promise<ISelectManyPromptConfig>;
    run(): Promise<IBlockExit>;
}
//# sourceMappingURL=SelectManyResponseBlockRunner.d.ts.map