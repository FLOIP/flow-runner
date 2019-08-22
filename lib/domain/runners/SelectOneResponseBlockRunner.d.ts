import IBlockRunner from './IBlockRunner';
import IBlock from '../../flow-spec/IBlock';
import { ISelectOnePromptConfig } from '../..';
import IBlockExit from '../../flow-spec/IBlockExit';
import ISelectOneResponseBlockConfig from '../../model/block/ISelectOneResponseBlockConfig';
export default class SelectOneResponseBlockRunner implements IBlockRunner {
    block: IBlock & {
        config: ISelectOneResponseBlockConfig;
    };
    constructor(block: IBlock & {
        config: ISelectOneResponseBlockConfig;
    });
    initialize(): ISelectOnePromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=SelectOneResponseBlockRunner.d.ts.map