import IBehaviour from '../IBehaviour';
import IBlockInteraction from '../../../flow-spec/IBlockInteraction';
import IContext, { RichCursorType } from '../../../flow-spec/IContext';
import { IFlowNavigator, IPromptBuilder } from '../../FlowRunner';
import IPrompt, { IBasePromptConfig, IPromptConfig } from '../../prompt/IPrompt';
export interface IBackTrackingBehaviour extends IBehaviour {
    rebuildIndex(): void;
    jumpTo(interaction: IBlockInteraction, context: IContext): RichCursorType;
    peek(steps?: number): IPrompt<IPromptConfig<any> & IBasePromptConfig>;
}
export default class BacktrackingBehaviour implements IBackTrackingBehaviour {
    context: IContext;
    navigator: IFlowNavigator;
    promptBuilder: IPromptBuilder;
    constructor(context: IContext, navigator: IFlowNavigator, promptBuilder: IPromptBuilder);
    rebuildIndex(): void;
    jumpTo(interaction: IBlockInteraction, context: IContext): RichCursorType;
    peek(steps?: number): IPrompt<IPromptConfig<any> & IBasePromptConfig>;
    postInteractionCreate(interaction: IBlockInteraction, _context: IContext): IBlockInteraction;
    postInteractionComplete(_interaction: IBlockInteraction, _context: IContext): void;
}
//# sourceMappingURL=BasicBacktrackingBehaviour.d.ts.map