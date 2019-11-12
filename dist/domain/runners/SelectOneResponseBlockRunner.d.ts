import IBlockRunner from './IBlockRunner';
import { ISelectOnePromptConfig } from '../..';
import IBlockExit from '../../flow-spec/IBlockExit';
import ISelectOneResponseBlock from '../../model/block/ISelectOneResponseBlock';
import IContext from '../../flow-spec/IContext';
import IBlockInteraction from '../../flow-spec/IBlockInteraction';
export default class SelectOneResponseBlockRunner implements IBlockRunner {
    block: ISelectOneResponseBlock;
    context: IContext;
    constructor(block: ISelectOneResponseBlock, context: IContext);
    initialize({ value }: IBlockInteraction): ISelectOnePromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=SelectOneResponseBlockRunner.d.ts.map