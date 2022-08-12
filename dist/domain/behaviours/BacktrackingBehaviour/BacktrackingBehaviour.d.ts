/**
 * Flow Interoperability Project (flowinterop.org)
 * Flow Runner
 * Copyright (c) 2019, 2020 Viamo Inc.
 * Authored by: Brett Zabos (brett.zabos@viamo.io)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/
import { IBehaviour, IBlockInteraction, IContext, IFlowNavigator, IPrompt, IPromptBuilder, IRichCursor, IStack, Key } from '../../..';
export interface IBacktrackingContext {
    /**
     * Current key into interaction hierarchy */
    cursor: Key;
    /**
     * Hierarchical list of interactions */
    interactionStack: IStack;
    /**
     * Ghost lists of interactions; we follow these stacks when stepping forward after a backtrack to receive suggestions. */
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
    peek(steps?: number): Promise<IPrompt>;
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
    peek(steps?: number): Promise<IPrompt>;
    findIndexOfSuggestionFor({ block_id }: IBlockInteraction, key: Key, stack: IStack): Key | undefined;
    postInteractionCreate(interaction: IBlockInteraction, _context: IContext): IBlockInteraction;
    /**
     * A hierarchical deep splice to remove items between two keys, hoisting deepest iteration to main depth.
     * ghost=[[0, 1], [1, 3], [0, 1], [1, 2]]
     * main=[[0, 1], [1, 4]] */
    syncGhostTo(key: Key, keyForSuggestion: Key, ghost: IStack): void;
    postInteractionComplete(interaction: IBlockInteraction, _context: IContext): void;
}
export {};
//# sourceMappingURL=BacktrackingBehaviour.d.ts.map