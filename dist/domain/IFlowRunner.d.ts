import IContext, { RichCursorInputRequiredType, RichCursorType } from '../flow-spec/IContext';
import IBlock from '../flow-spec/IBlock';
import IBlockRunner from './runners/IBlockRunner';
import IResourceResolver from './IResourceResolver';
export declare type IBlockRunnerFactoryStore = Map<string, {
    (block: IBlock, resources: IResourceResolver): IBlockRunner;
}>;
export default interface IFlowRunner {
    context: IContext;
    runnerFactoryStore: IBlockRunnerFactoryStore;
    resources: IResourceResolver;
    initialize(): RichCursorType | undefined;
    run(): RichCursorInputRequiredType | undefined;
}
//# sourceMappingURL=IFlowRunner.d.ts.map