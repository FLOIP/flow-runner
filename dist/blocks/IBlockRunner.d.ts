import { IBlock, IBlockExit, IBlockInteraction, IContext, IPromptConfig, IRichCursor } from '../index';
export interface IBlockRunner {
    block: IBlock;
    context: IContext;
    initialize(interaction: IBlockInteraction): Promise<IPromptConfig<any> | undefined>;
    run(cursor: IRichCursor): Promise<IBlockExit>;
}
//# sourceMappingURL=IBlockRunner.d.ts.map