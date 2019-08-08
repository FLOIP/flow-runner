import IContext, {RichCursorInputRequiredType} from "../flow-spec/IContext";
import IBlock from "../flow-spec/IBlock";
import IBlockRunner from "./runners/IBlockRunner";

export type IBlockRunnerFactoryStore = Map<string, {(block: IBlock): IBlockRunner}>

export default interface IFlowRunner {
  context: IContext
  runnerFactoryStore: IBlockRunnerFactoryStore

  // new (context: IContext, runnerFactoryStore: IBlockRunnerFactoryStore): IFlowRunner

  initialize(): void
  run(): RichCursorInputRequiredType | null

}
