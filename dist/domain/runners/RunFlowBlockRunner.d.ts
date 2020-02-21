import IBlockRunner from './IBlockRunner';
import IBlock from '../../flow-spec/IBlock';
import IBlockExit from '../../flow-spec/IBlockExit';
import IRunFlowBlockConfig from '../../model/block/IRunFlowBlockConfig';
import IContext from '../../flow-spec/IContext';
export declare class RunFlowBlockRunner implements IBlockRunner {
    block: IBlock & {
        config: IRunFlowBlockConfig;
    };
    context: IContext;
    constructor(block: IBlock & {
        config: IRunFlowBlockConfig;
    }, context: IContext);
    initialize(): undefined;
    run(): IBlockExit;
}
export default RunFlowBlockRunner;
//# sourceMappingURL=RunFlowBlockRunner.d.ts.map