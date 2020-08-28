import { IBehaviour, IBlockInteraction, IContext, IFlowNavigator, IPromptBuilder, IRichCursor, IRichCursorInputRequired } from '../../..';
export declare enum PeekDirection {
    RIGHT = "RIGHT",
    LEFT = "LEFT"
}
export interface IBasicBackTrackingBehaviour extends IBehaviour {
    rebuildIndex(): void;
    jumpTo(interaction: IBlockInteraction): Promise<IRichCursor>;
    peek(steps?: number): Promise<IRichCursor>;
    seek(steps?: number): Promise<IRichCursor>;
}
export declare class BasicBacktrackingBehaviour implements IBasicBackTrackingBehaviour {
    context: IContext;
    navigator: IFlowNavigator;
    promptBuilder: IPromptBuilder;
    constructor(context: IContext, navigator: IFlowNavigator, promptBuilder: IPromptBuilder);
    rebuildIndex(): void;
    seek(steps?: number, context?: IContext): Promise<IRichCursorInputRequired>;
    jumpTo(intx: IBlockInteraction, context?: IContext): Promise<IRichCursor>;
    _findInteractiveInteractionAt(steps?: number, context?: IContext, direction?: PeekDirection): IBlockInteraction;
    peek(steps?: number, context?: IContext, direction?: PeekDirection): Promise<IRichCursorInputRequired>;
    postInteractionCreate(interaction: IBlockInteraction, _context: IContext): IBlockInteraction;
    postInteractionComplete(_interaction: IBlockInteraction, _context: IContext): void;
}
//# sourceMappingURL=BasicBacktrackingBehaviour.d.ts.map