import { IBlock, IBlockExit, IBlockInteraction, IContext, IPromptConfig, IRichCursor } from '../..';
export interface IBlockRunner {
    block: IBlock;
    context: IContext;
    initialize(interaction: IBlockInteraction): Promise<IPromptConfig | undefined>;
    run(cursor: IRichCursor): Promise<IBlockExit>;
}
//# sourceMappingURL=IBlockRunner.d.ts.map