import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import IContext, { IRichCursorInputRequired } from '../../flow-spec/IContext';
import IReadBlock from '../../model/block/IReadBlock';
import { IReadPromptConfig } from '../prompt/IReadPromptConfig';
export declare class ReadBlockRunner implements IBlockRunner {
    block: IReadBlock;
    context: IContext;
    constructor(block: IReadBlock, context: IContext);
    initialize(): IReadPromptConfig;
    run({ interaction, prompt }: IRichCursorInputRequired): Promise<IBlockExit>;
}
export default ReadBlockRunner;
//# sourceMappingURL=ReadBlockRunner.d.ts.map