import IBlockRunner from './IBlockRunner';
import IBlock from '../../flow-spec/IBlock';
import IBlockExit from '../../flow-spec/IBlockExit';
import { IOpenPromptConfig } from '../prompt/IOpenPromptConfig';
import IOpenResponseBlockConfig from '../../model/block/IOpenResponseBlockConfig';
export default class OpenResponseBlockRunner implements IBlockRunner {
    block: IBlock & {
        config: IOpenResponseBlockConfig;
    };
    constructor(block: IBlock & {
        config: IOpenResponseBlockConfig;
    });
    initialize(): IOpenPromptConfig;
    run(): IBlockExit;
}
//# sourceMappingURL=OpenResponseBlockRunner.d.ts.map