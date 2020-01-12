import {NonBreakingUpdateOperation} from 'sp2'
import IContext, {TRichCursorInputRequired, TRichCursor} from '../flow-spec/IContext'
import IBlock from '../flow-spec/IBlock'
import IBlockRunner from './runners/IBlockRunner'

export type TBlockRunnerFactory = { (block: IBlock, ctx: IContext): IBlockRunner }

export type IBlockRunnerFactoryStore = Map<string, TBlockRunnerFactory>

export default interface IFlowRunner {
  context: IContext
  runnerFactoryStore: IBlockRunnerFactoryStore

  // new (context: IContext): IFlowRunner

  initialize(): TRichCursor | undefined

  run(): TRichCursorInputRequired | undefined

  applyReversibleDataOperation(forward: NonBreakingUpdateOperation, reverse: NonBreakingUpdateOperation, context: IContext): void
}
