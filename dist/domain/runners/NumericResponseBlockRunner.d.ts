import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import { INumericPromptConfig } from '../..';
import INumericResponseBlock from '../../model/block/INumericResponseBlock';
import IResourceResolver from '../IResourceResolver';
export default class NumericResponseBlockRunner implements IBlockRunner {
    block: INumericResponseBlock;
    resources: IResourceResolver;
    constructor(block: INumericResponseBlock, resources: IResourceResolver);
    initialize(): INumericPromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=NumericResponseBlockRunner.d.ts.map