import IContext, { RichCursorInputRequiredType, RichCursorType } from '../flow-spec/IContext';
import IBlock from '../flow-spec/IBlock';
import IBlockRunner from './runners/IBlockRunner';
export declare type IBlockRunnerFactoryStore = Map<string, {
    (block: IBlock, ctx: IContext): IBlockRunner;
}>;
export default interface IFlowRunner {
    context: IContext;
    runnerFactoryStore: IBlockRunnerFactoryStore;
    initialize(): RichCursorType | undefined;
    run(): RichCursorInputRequiredType | undefined;
}
//# sourceMappingURL=IFlowRunner.d.ts.map