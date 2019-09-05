import IBlockRunner from './IBlockRunner';
import IBlock from '../../flow-spec/IBlock';
import IBlockExit from '../../flow-spec/IBlockExit';
import IRunFlowBlockConfig from '../../model/block/IRunFlowBlockConfig';
import IResourceResolver from '../IResourceResolver';
export default class RunFlowBlockRunner implements IBlockRunner {
    block: IBlock & {
        config: IRunFlowBlockConfig;
    };
    resources: IResourceResolver;
    constructor(block: IBlock & {
        config: IRunFlowBlockConfig;
    }, resources: IResourceResolver);
    initialize(): undefined;
    run(): IBlockExit;
}
//# sourceMappingURL=RunFlowBlockRunner.d.ts.map