import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import { IOpenPromptConfig } from '../..';
import IOpenResponseBlock from '../../model/block/IOpenResponseBlock';
import IContext from '../../flow-spec/IContext';
import IBlockInteraction from '../../flow-spec/IBlockInteraction';
export default class OpenResponseBlockRunner implements IBlockRunner {
    block: IOpenResponseBlock;
    context: IContext;
    constructor(block: IOpenResponseBlock, context: IContext);
    initialize({ value }: IBlockInteraction): IOpenPromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=OpenResponseBlockRunner.d.ts.map