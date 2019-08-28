import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import { IOpenPromptConfig } from '../..';
import IOpenResponseBlock from '../../model/block/IOpenResponseBlock';
export default class OpenResponseBlockRunner implements IBlockRunner {
    block: IOpenResponseBlock;
    constructor(block: IOpenResponseBlock);
    initialize(): IOpenPromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=OpenResponseBlockRunner.d.ts.map