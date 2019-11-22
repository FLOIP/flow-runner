import IContext, {RichCursorInputRequiredType, RichCursorType} from '../flow-spec/IContext'
import IBlock from '../flow-spec/IBlock'
import IBlockRunner from './runners/IBlockRunner'

export type IBlockRunnerFactoryStore = Map<string, { (block: IBlock, ctx: IContext): IBlockRunner }>

export default interface IFlowRunner {
  context: IContext
  runnerFactoryStore: IBlockRunnerFactoryStore

  // new (context: IContext): IFlowRunner

  initialize(): RichCursorType | undefined

  run(): RichCursorInputRequiredType | undefined
}
