import { IBlockExit, IBlockInteraction, IBlockRunner, IContext, IAdvancedSelectOneBlock, IAdvancedSelectOnePromptConfig } from '../..';
import { IRichCursor } from '../../flow-spec/IContext';
export declare class AdvancedSelectOneBlockRunner implements IBlockRunner {
    block: IAdvancedSelectOneBlock;
    context: IContext;
    constructor(block: IAdvancedSelectOneBlock, context: IContext);
    initialize({ value }: IBlockInteraction): Promise<IAdvancedSelectOnePromptConfig>;
    run(cursor: IRichCursor): Promise<IBlockExit>;
}
//# sourceMappingURL=AdvancedSelectOneBlockRunner.d.ts.map