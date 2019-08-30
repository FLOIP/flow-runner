import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import { INumericPromptConfig } from '../..';
import INumericResponseBlock from '../../model/block/INumericResponseBlock';
export default class NumericResponseBlockRunner implements IBlockRunner {
    block: INumericResponseBlock;
    constructor(block: INumericResponseBlock);
    initialize(): INumericPromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=NumericResponseBlockRunner.d.ts.map