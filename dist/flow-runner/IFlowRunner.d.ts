import { NonBreakingUpdateOperation } from 'sp2';
import { IBlock, IBlockRunner, IContext, IRichCursor, IRichCursorInputRequired } from '../index';
export declare type TBlockRunnerFactory = {
    (block: IBlock, ctx: IContext): IBlockRunner;
};
export declare type IBlockRunnerFactoryStore = Map<string, TBlockRunnerFactory>;
export interface IFlowRunner {
    context: IContext;
    runnerFactoryStore: IBlockRunnerFactoryStore;
    initialize(): Promise<IRichCursor | undefined>;
    run(): Promise<IRichCursorInputRequired | undefined>;
    applyReversibleDataOperation(forward: NonBreakingUpdateOperation, reverse: NonBreakingUpdateOperation, context: IContext): void;
}
//# sourceMappingURL=IFlowRunner.d.ts.map