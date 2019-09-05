import IBlockRunner from './IBlockRunner';
import { ISelectOnePromptConfig } from '../..';
import IBlockExit from '../../flow-spec/IBlockExit';
import ISelectOneResponseBlock from '../../model/block/ISelectOneResponseBlock';
import IResourceResolver from '../IResourceResolver';
export default class SelectOneResponseBlockRunner implements IBlockRunner {
    block: ISelectOneResponseBlock;
    resources: IResourceResolver;
    constructor(block: ISelectOneResponseBlock, resources: IResourceResolver);
    initialize(): ISelectOnePromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=SelectOneResponseBlockRunner.d.ts.map