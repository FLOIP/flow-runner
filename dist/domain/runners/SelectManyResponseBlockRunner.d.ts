import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import ISelectOneResponseBlock from '../../model/block/ISelectOneResponseBlock';
import IContext from '../../flow-spec/IContext';
import { ISelectManyPromptConfig } from '../prompt/ISelectManyPromptConfig';
export default class SelectManyResponseBlockRunner implements IBlockRunner {
    block: ISelectOneResponseBlock;
    context: IContext;
    constructor(block: ISelectOneResponseBlock, context: IContext);
    initialize(): ISelectManyPromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=SelectManyResponseBlockRunner.d.ts.map