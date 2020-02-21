import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import { IOpenPromptConfig } from '../..';
import IOpenResponseBlock from '../../model/block/IOpenResponseBlock';
import IContext from '../../flow-spec/IContext';
import IBlockInteraction from '../../flow-spec/IBlockInteraction';
export declare class OpenResponseBlockRunner implements IBlockRunner {
    block: IOpenResponseBlock;
    context: IContext;
    constructor(block: IOpenResponseBlock, context: IContext);
    initialize({ value }: IBlockInteraction): IOpenPromptConfig;
    run(): IBlockExit;
}
export default OpenResponseBlockRunner;
//# sourceMappingURL=OpenResponseBlockRunner.d.ts.map