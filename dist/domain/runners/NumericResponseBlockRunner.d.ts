import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import { INumericPromptConfig } from '../..';
import INumericResponseBlock from '../../model/block/INumericResponseBlock';
import IContext from '../../flow-spec/IContext';
export default class NumericResponseBlockRunner implements IBlockRunner {
    block: INumericResponseBlock;
    context: IContext;
    constructor(block: INumericResponseBlock, context: IContext);
    initialize(): INumericPromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=NumericResponseBlockRunner.d.ts.map