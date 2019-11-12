import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import ISelectOneResponseBlock from '../../model/block/ISelectOneResponseBlock';
import IContext from '../../flow-spec/IContext';
import { ISelectManyPromptConfig } from '../prompt/ISelectManyPromptConfig';
import IBlockInteraction from '../../flow-spec/IBlockInteraction';
export default class SelectManyResponseBlockRunner implements IBlockRunner {
    block: ISelectOneResponseBlock;
    context: IContext;
    constructor(block: ISelectOneResponseBlock, context: IContext);
    initialize({ value }: IBlockInteraction): ISelectManyPromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=SelectManyResponseBlockRunner.d.ts.map