import IBehaviour from '../IBehaviour';
import IBlockInteraction from '../../../flow-spec/IBlockInteraction';
import IContext, { IRichCursor, IRichCursorInputRequired } from '../../../flow-spec/IContext';
import { IFlowNavigator, IPromptBuilder } from '../../FlowRunner';
export interface IBackTrackingBehaviour extends IBehaviour {
    rebuildIndex(): void;
    jumpTo(interaction: IBlockInteraction): Promise<IRichCursor>;
    peek(steps?: number): Promise<IRichCursor>;
    seek(steps?: number): Promise<IRichCursor>;
}
export declare class BasicBacktrackingBehaviour implements IBackTrackingBehaviour {
    context: IContext;
    navigator: IFlowNavigator;
    promptBuilder: IPromptBuilder;
    constructor(context: IContext, navigator: IFlowNavigator, promptBuilder: IPromptBuilder);
    rebuildIndex(): void;
    seek(steps?: number, context?: IContext): Promise<IRichCursorInputRequired>;
    jumpTo(intx: IBlockInteraction, context?: IContext): Promise<IRichCursor>;
    peek(steps?: number, context?: IContext): Promise<IRichCursorInputRequired>;
    postInteractionCreate(interaction: IBlockInteraction, _context: IContext): IBlockInteraction;
    postInteractionComplete(_interaction: IBlockInteraction, _context: IContext): void;
}
export default BasicBacktrackingBehaviour;
//# sourceMappingURL=BasicBacktrackingBehaviour.d.ts.map