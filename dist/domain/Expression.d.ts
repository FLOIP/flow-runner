import IContext from '../flow-spec/IContext';
import IBlock from '../flow-spec/IBlock';
import IFlow from '../flow-spec/IFlow';
export interface IExpressionContext extends IContext {
    block: IBlock;
    flow: IFlow;
}
export default class Expression {
    evalContext: IExpressionContext;
    constructor(evalContext: IExpressionContext);
    evaluate(): void;
}
//# sourceMappingURL=Expression.d.ts.map