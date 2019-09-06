import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import { IOpenPromptConfig } from '../..';
import IOpenResponseBlock from '../../model/block/IOpenResponseBlock';
import IContext from '../../flow-spec/IContext';
export default class OpenResponseBlockRunner implements IBlockRunner {
    block: IOpenResponseBlock;
    context: IContext;
    constructor(block: IOpenResponseBlock, context: IContext);
    initialize(): IOpenPromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=OpenResponseBlockRunner.d.ts.map