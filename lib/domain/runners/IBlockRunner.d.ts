import IBlock from '../../flow-spec/IBlock';
import IBlockInteraction from '../../flow-spec/IBlockInteraction';
import IBlockExit from '../../flow-spec/IBlockExit';
import { RichCursorType } from '../../flow-spec/IContext';
import { IPromptConfig } from '../prompt/IPrompt';
export default interface IBlockRunner {
    block: IBlock;
    initialize(interaction?: IBlockInteraction): IPromptConfig<any> | undefined;
    run(cursor?: RichCursorType): IBlockExit;
}
//# sourceMappingURL=IBlockRunner.d.ts.map