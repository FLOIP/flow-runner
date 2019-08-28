import IBlockRunner from './IBlockRunner';
import { ISelectOnePromptConfig } from '../..';
import IBlockExit from '../../flow-spec/IBlockExit';
import ISelectOneResponseBlock from '../../model/block/ISelectOneResponseBlock';
export default class SelectOneResponseBlockRunner implements IBlockRunner {
    block: ISelectOneResponseBlock;
    constructor(block: ISelectOneResponseBlock);
    initialize(): ISelectOnePromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=SelectOneResponseBlockRunner.d.ts.map