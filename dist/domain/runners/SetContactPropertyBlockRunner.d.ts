import IBlockRunner from './IBlockRunner';
import ISetContactPropertyBlock from '../../model/block/ISetContactPropertyBlock';
import IContext from '../../flow-spec/IContext';
import IBlockExit from '../../flow-spec/IBlockExit';
export default class SetContactPropertyBlockRunner implements IBlockRunner {
    block: ISetContactPropertyBlock;
    context: IContext;
    constructor(block: ISetContactPropertyBlock, context: IContext);
    initialize(): undefined;
    run(): IBlockExit;
}
//# sourceMappingURL=SetContactPropertyBlockRunner.d.ts.map