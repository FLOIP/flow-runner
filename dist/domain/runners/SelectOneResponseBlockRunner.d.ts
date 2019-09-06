import IBlockRunner from './IBlockRunner';
import { ISelectOnePromptConfig } from '../..';
import IBlockExit from '../../flow-spec/IBlockExit';
import ISelectOneResponseBlock from '../../model/block/ISelectOneResponseBlock';
import IContext from '../../flow-spec/IContext';
import { Evaluator } from 'floip-expression-evaluator-ts';
export default class SelectOneResponseBlockRunner implements IBlockRunner {
    block: ISelectOneResponseBlock;
    context: IContext;
    constructor(block: ISelectOneResponseBlock, context: IContext);
    initialize(): ISelectOnePromptConfig;
    run(): IBlockExit;
    evaluateToBool(expr: string, ctx: object, evaluator: Evaluator): any;
}
//# sourceMappingURL=SelectOneResponseBlockRunner.d.ts.map