import { IAdvancedSelectOneBlock, IAdvancedSelectOnePromptConfig, IBlockExit, IBlockInteraction, IBlockRunner, IContext, IRichCursor } from '../..';
export declare class AdvancedSelectOneBlockRunner implements IBlockRunner {
    block: IAdvancedSelectOneBlock;
    context: IContext;
    constructor(block: IAdvancedSelectOneBlock, context: IContext);
    initialize({ value }: IBlockInteraction): Promise<IAdvancedSelectOnePromptConfig>;
    run(cursor: IRichCursor): Promise<IBlockExit>;
}
//# sourceMappingURL=AdvancedSelectOneBlockRunner.d.ts.map