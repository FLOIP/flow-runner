import IContext, {RichCursorInputRequiredType, RichCursorType} from '../flow-spec/IContext'
import IBlock from '../flow-spec/IBlock'
import IBlockRunner from './runners/IBlockRunner'
import IResourceResolver from './IResourceResolver'

export type IBlockRunnerFactoryStore = Map<string, { (block: IBlock, resources: IResourceResolver): IBlockRunner }>

export default interface IFlowRunner {
  context: IContext
  runnerFactoryStore: IBlockRunnerFactoryStore
  resources: IResourceResolver

  // new (context: IContext, runnerFactoryStore: IBlockRunnerFactoryStore): IFlowRunner

  initialize(): RichCursorType | undefined

  run(): RichCursorInputRequiredType | undefined
}
