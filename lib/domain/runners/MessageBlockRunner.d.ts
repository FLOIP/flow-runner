import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import { IMessagePromptConfig } from '../prompt/IMessagePromptConfig';
import IMessageBlock from '../../model/block/IMessageBlock';
export default class MessageBlockRunner implements IBlockRunner {
    block: IMessageBlock;
    constructor(block: IMessageBlock);
    initialize(): IMessagePromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=MessageBlockRunner.d.ts.map