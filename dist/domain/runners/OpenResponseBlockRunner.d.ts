import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import { IOpenPromptConfig } from '../..';
import IOpenResponseBlock from '../../model/block/IOpenResponseBlock';
import IResourceResolver from '../IResourceResolver';
export default class OpenResponseBlockRunner implements IBlockRunner {
    block: IOpenResponseBlock;
    resources: IResourceResolver;
    constructor(block: IOpenResponseBlock, resources: IResourceResolver);
    initialize(): IOpenPromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=OpenResponseBlockRunner.d.ts.map