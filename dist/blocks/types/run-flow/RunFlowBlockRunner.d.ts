import { IBlock, IBlockExit, IBlockRunner, IContext, IRunFlowBlockConfig } from '../../../index';
export declare class RunFlowBlockRunner implements IBlockRunner {
    block: IBlock & {
        config: IRunFlowBlockConfig;
    };
    context: IContext;
    constructor(block: IBlock & {
        config: IRunFlowBlockConfig;
    }, context: IContext);
    initialize(): Promise<undefined>;
    run(): Promise<IBlockExit>;
}
//# sourceMappingURL=RunFlowBlockRunner.d.ts.map