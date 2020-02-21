/// <reference types="node" />
import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import IContext from '../../flow-spec/IContext';
import IPrintBlock from '../../model/block/IPrintBlock';
export declare class PrintBlockRunner implements IBlockRunner {
    block: IPrintBlock;
    context: IContext;
    console: Console;
    constructor(block: IPrintBlock, context: IContext, console?: Console);
    initialize(): undefined;
    run(): IBlockExit;
}
export default PrintBlockRunner;
//# sourceMappingURL=PrintBlockRunner.d.ts.map