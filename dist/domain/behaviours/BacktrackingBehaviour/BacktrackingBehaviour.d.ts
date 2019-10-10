import IBehaviour from '../IBehaviour';
import IBlockInteraction from '../../../flow-spec/IBlockInteraction';
import IContext, { RichCursorType } from '../../../flow-spec/IContext';
import { IStack, Key } from './HierarchicalIterStack';
import { IFlowNavigator } from '../../FlowRunner';
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
export default class BacktrackingBehaviour implements IBehaviour {
    context: IContext;
    navigator: IFlowNavigator;
    constructor(context: IContext, navigator: IFlowNavigator);
    initializeBacktrackingContext(): void;
    hasIndex(): boolean;
    rebuildIndex(): void;
    insertInteractionUsing(key: BacktrackingCursor, interaction: IBlockInteraction, interactionStack: BacktrackingIntxStack): void;
    _stepOut(keyToBeginningOfStackWithHeadMatchingBlock: Key, interactionStack: BacktrackingIntxStack, interaction: IBlockInteraction, key: BacktrackingCursor): void;
    _stepIn(key: BacktrackingCursor, interactionStack: BacktrackingIntxStack, keyForIntxOfRepeatedBlock: Key, interaction: IBlockInteraction): void;
    jumpTo(interaction: IBlockInteraction, context: IContext): RichCursorType;
    peek(_steps?: number): void;
    findIndexOfSuggestionFor({ blockId }: IBlockInteraction, key: Key, stack: IStack): Key | undefined;
    postInteractionCreate(interaction: IBlockInteraction, _context: IContext): IBlockInteraction;
    syncGhostTo(key: Key, keyForSuggestion: Key, ghost: IStack): void;
    postInteractionComplete(interaction: IBlockInteraction, _context: IContext): void;
}
export {};
//# sourceMappingURL=BacktrackingBehaviour.d.ts.map