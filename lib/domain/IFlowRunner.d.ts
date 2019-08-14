import IContext, { RichCursorInputRequiredType } from "../flow-spec/IContext";
import IBlock from "../flow-spec/IBlock";
import IBlockRunner from "./runners/IBlockRunner";
export declare type IBlockRunnerFactoryStore = Map<string, {
    (block: IBlock): IBlockRunner;
}>;
export default interface IFlowRunner {
    context: IContext;
    runnerFactoryStore: IBlockRunnerFactoryStore;
    initialize(): void;
    run(): RichCursorInputRequiredType | null;
}
//# sourceMappingURL=IFlowRunner.d.ts.map