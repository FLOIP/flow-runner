import IBlockRunner from './IBlockRunner';
import IBlockExit from '../../flow-spec/IBlockExit';
import { INumericPromptConfig } from '../..';
import INumericResponseBlock from '../../model/block/INumericResponseBlock';
import IContext from '../../flow-spec/IContext';
import IBlockInteraction from '../../flow-spec/IBlockInteraction';
export declare class NumericResponseBlockRunner implements IBlockRunner {
    block: INumericResponseBlock;
    context: IContext;
    constructor(block: INumericResponseBlock, context: IContext);
    initialize({ value }: IBlockInteraction): Promise<INumericPromptConfig>;
    run(): Promise<IBlockExit>;
}
export default NumericResponseBlockRunner;
//# sourceMappingURL=NumericResponseBlockRunner.d.ts.map