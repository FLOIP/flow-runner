import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import { INumericPromptConfig } from '../prompt/INumericPromptConfig';
import IBlock from '../../flow-spec/IBlock';
import INumericBlockConfig from '../../model/block/INumericBlockConfig';
export default class NumericResponseBlockRunner implements IBlockRunner {
    block: IBlock & {
        config: INumericBlockConfig;
    };
    constructor(block: IBlock & {
        config: INumericBlockConfig;
    });
    initialize(): INumericPromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=NumericResponseBlockRunner.d.ts.map