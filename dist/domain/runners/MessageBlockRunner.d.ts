import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import { IMessagePromptConfig } from '../..';
import IMessageBlock from '../../model/block/IMessageBlock';
import IResourceResolver from '../IResourceResolver';
export default class MessageBlockRunner implements IBlockRunner {
    block: IMessageBlock;
    resources: IResourceResolver;
    constructor(block: IMessageBlock, resources: IResourceResolver);
    initialize(): IMessagePromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=MessageBlockRunner.d.ts.map