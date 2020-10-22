import { IAdvancedSelectOneBlock, IAdvancedSelectOnePromptConfig, IBlockExit, IBlockInteraction, IBlockRunner, IContext } from '../..';
export declare class AdvancedSelectOneBlockRunner implements IBlockRunner {
    block: IAdvancedSelectOneBlock;
    context: IContext;
    constructor(block: IAdvancedSelectOneBlock, context: IContext);
    initialize({ value }: IBlockInteraction): Promise<IAdvancedSelectOnePromptConfig>;
    run(): Promise<IBlockExit>;
}
//# sourceMappingURL=AdvancedSelectOneBlockRunner.d.ts.map