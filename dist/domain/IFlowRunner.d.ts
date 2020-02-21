import { NonBreakingUpdateOperation } from 'sp2';
import IContext, { IRichCursorInputRequired, IRichCursor } from '../flow-spec/IContext';
import IBlock from '../flow-spec/IBlock';
import IBlockRunner from './runners/IBlockRunner';
export declare type TBlockRunnerFactory = {
    (block: IBlock, ctx: IContext): IBlockRunner;
};
export declare type IBlockRunnerFactoryStore = Map<string, TBlockRunnerFactory>;
export interface IFlowRunner {
    context: IContext;
    runnerFactoryStore: IBlockRunnerFactoryStore;
    initialize(): IRichCursor | undefined;
    run(): IRichCursorInputRequired | undefined;
    applyReversibleDataOperation(forward: NonBreakingUpdateOperation, reverse: NonBreakingUpdateOperation, context: IContext): void;
}
export default IFlowRunner;
//# sourceMappingURL=IFlowRunner.d.ts.map