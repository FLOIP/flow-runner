import IContext from '../flow-spec/IContext'
import IBlock from '../flow-spec/IBlock'
import IFlow from '../flow-spec/IFlow'

export interface IExpressionContext extends IContext {
  block: IBlock, // current block
  flow: IFlow, // current flow
}

export default class Expression {
  constructor(
    public evalContext: IExpressionContext) {}

  evaluate() {

  }
}