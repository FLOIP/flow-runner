import IBehaviour from '../IBehaviour';
import IBlockInteraction from '../../../flow-spec/IBlockInteraction';
import IContext, { RichCursorInputRequiredType, RichCursorType } from '../../../flow-spec/IContext';
import { IFlowNavigator, IPromptBuilder } from '../../FlowRunner';
export interface IBackTrackingBehaviour extends IBehaviour {
    rebuildIndex(): void;
    jumpTo(interaction: IBlockInteraction): RichCursorType;
    peek(steps?: number): RichCursorType;
    seek(steps?: number): RichCursorType;
}
export default class BasicBacktrackingBehaviour implements IBackTrackingBehaviour {
    context: IContext;
    navigator: IFlowNavigator;
    promptBuilder: IPromptBuilder;
    constructor(context: IContext, navigator: IFlowNavigator, promptBuilder: IPromptBuilder);
    rebuildIndex(): void;
    seek(steps?: number, context?: IContext): RichCursorInputRequiredType;
    jumpTo(intx: IBlockInteraction, context?: IContext): RichCursorType;
    peek(steps?: number, context?: IContext): RichCursorInputRequiredType;
    postInteractionCreate(interaction: IBlockInteraction, _context: IContext): IBlockInteraction;
    postInteractionComplete(_interaction: IBlockInteraction, _context: IContext): void;
}
//# sourceMappingURL=BasicBacktrackingBehaviour.d.ts.map