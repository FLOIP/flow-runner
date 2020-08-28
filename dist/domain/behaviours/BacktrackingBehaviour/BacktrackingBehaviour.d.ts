import { IBehaviour, IBlockInteraction, IContext, IFlowNavigator, IPrompt, IPromptBuilder, IPromptConfig, IRichCursor, IStack, Key } from '../../..';
export interface IBacktrackingContext {
    cursor: Key;
    interactionStack: IStack;
    ghostInteractionStacks: IStack[];
}
export interface IContextBacktrackingPlatformMetadata {
    backtracking: IBacktrackingContext;
}
declare type BacktrackingCursor = IBacktrackingContext['cursor'];
declare type BacktrackingIntxStack = IBacktrackingContext['interactionStack'];
export interface IBackTrackingBehaviour extends IBehaviour {
    rebuildIndex(): void;
    jumpTo(interaction: IBlockInteraction, context: IContext): Promise<IRichCursor>;
    peek(steps?: number): Promise<IPrompt<IPromptConfig<any>>>;
}
export declare class BacktrackingBehaviour implements IBackTrackingBehaviour {
    context: IContext;
    navigator: IFlowNavigator;
    promptBuilder: IPromptBuilder;
    constructor(context: IContext, navigator: IFlowNavigator, promptBuilder: IPromptBuilder);
    initializeBacktrackingContext(): void;
    hasIndex(): boolean;
    rebuildIndex(): void;
    insertInteractionUsing(key: BacktrackingCursor, interaction: IBlockInteraction, interactionStack: BacktrackingIntxStack): void;
    _stepOut(keyToBeginningOfStackWithHeadMatchingBlock: Key, interactionStack: BacktrackingIntxStack, interaction: IBlockInteraction, key: BacktrackingCursor): void;
    _stepIn(key: BacktrackingCursor, interactionStack: BacktrackingIntxStack, keyForIntxOfRepeatedBlock: Key, interaction: IBlockInteraction): void;
    jumpTo(interaction: IBlockInteraction, context: IContext): Promise<IRichCursor>;
    peek(steps?: number): Promise<IPrompt<IPromptConfig<any>>>;
    findIndexOfSuggestionFor({ blockId }: IBlockInteraction, key: Key, stack: IStack): Key | undefined;
    postInteractionCreate(interaction: IBlockInteraction, _context: IContext): IBlockInteraction;
    syncGhostTo(key: Key, keyForSuggestion: Key, ghost: IStack): void;
    postInteractionComplete(interaction: IBlockInteraction, _context: IContext): void;
}
export {};
//# sourceMappingURL=BacktrackingBehaviour.d.ts.map