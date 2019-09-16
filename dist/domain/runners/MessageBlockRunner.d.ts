import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import { IMessagePromptConfig } from '../..';
import IMessageBlock from '../../model/block/IMessageBlock';
import IContext from '../../flow-spec/IContext';
export default class MessageBlockRunner implements IBlockRunner {
    block: IMessageBlock;
    context: IContext;
    constructor(block: IMessageBlock, context: IContext);
    initialize(): IMessagePromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=MessageBlockRunner.d.ts.map