import IBlock from '../../flow-spec/IBlock';
import IBlockInteraction from '../../flow-spec/IBlockInteraction';
import IBlockExit from '../../flow-spec/IBlockExit';
import { IRichCursor } from '../..';
import { IPromptConfig } from '../..';
import IContext from '../../flow-spec/IContext';
export interface IBlockRunner {
    block: IBlock;
    context: IContext;
    initialize(interaction: IBlockInteraction): IPromptConfig<any> | undefined;
    run(cursor: IRichCursor): IBlockExit;
}
export default IBlockRunner;
//# sourceMappingURL=IBlockRunner.d.ts.map