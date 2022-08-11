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
import { IBehaviour, IBlockInteraction, IContext, IFlowNavigator, IPromptBuilder, IRichCursor, IRichCursorInputRequired } from '../../..';
export declare enum PeekDirection {
    RIGHT = "RIGHT",
    LEFT = "LEFT"
}
/**
 * Interface for time-travel within interaction history.
 */
export interface IBasicBackTrackingBehaviour extends IBehaviour {
    /**
     * Rebuild index over interaction history from scratch.
     */
    rebuildIndex(): void;
    /**
     * Generates new prompt from new interaction + resets state to what was {@link IContext.interactions}'s moment
     * @param interaction
     * todo: this should likely take in steps rather than interaction itself */
    jumpTo(interaction: IBlockInteraction): Promise<IRichCursor>;
    /**
     * Regenerates prompt from previous interaction
     * @param steps
     */
    peek(steps?: number): Promise<IRichCursor>;
    /**
     * Regenerates prompt + interaction in place of previous interaction; updates {@link IContext.cursor}
     * @param steps
     */
    seek(steps?: number): Promise<IRichCursor>;
}
/**
 * Basic implementation of time-travel. Solely provides ability to preview what's happened in the past, while any
 * modifications will clear the past's future.
 */
export declare class BasicBacktrackingBehaviour implements IBasicBackTrackingBehaviour {
    context: IContext;
    navigator: IFlowNavigator;
    promptBuilder: IPromptBuilder;
    jumpContext?: {
        discardedInteractions: IBlockInteraction[];
        destinationInteraction: IBlockInteraction;
    };
    constructor(context: IContext, navigator: IFlowNavigator, promptBuilder: IPromptBuilder);
    rebuildIndex(): void;
    seek(steps?: number, context?: IContext): Promise<IRichCursorInputRequired>;
    jumpTo(destinationInteraction: IBlockInteraction, context?: IContext): Promise<IRichCursor>;
    _findInteractiveInteractionAt(steps?: number, context?: IContext, direction?: PeekDirection): IBlockInteraction;
    peek(steps?: number, context?: IContext, direction?: PeekDirection): Promise<IRichCursorInputRequired>;
    postInteractionCreate(interaction: IBlockInteraction, _context: IContext): IBlockInteraction;
    postInteractionComplete(_interaction: IBlockInteraction, _context: IContext): void;
}
//# sourceMappingURL=BasicBacktrackingBehaviour.d.ts.map