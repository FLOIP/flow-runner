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
import { NonBreakingUpdateOperation } from 'sp2';
import { IBehaviour, IBehaviourConstructor, IBlock, IBlockExit, IBlockInteraction, IBlockRunner, IBlockRunnerFactoryStore, IContext, IContextService, IContextWithCursor, ICursor, IFlowRunner, IIdGenerator, IMessageBlock, IPromptConfig, IReversibleUpdateOperation, IRichCursor, IRichCursorInputRequired, PromptConstructor, TBlockRunnerFactory, TGenericPrompt } from '..';
export declare class BlockRunnerFactoryStore extends Map<string, TBlockRunnerFactory> implements IBlockRunnerFactoryStore {
}
export interface IFlowNavigator {
    navigateTo(block: IBlock, ctx: IContext): Promise<IRichCursor>;
}
export interface IPromptBuilder {
    buildPromptFor(block: IBlock, interaction: IBlockInteraction): Promise<TGenericPrompt | undefined>;
}
/**
 * Block types that do not request additional input from an `IContact`
 */
export declare const NON_INTERACTIVE_BLOCK_TYPES: string[];
/**
 * A map of `IBlock.type` to an `TBlockRunnerFactory` function.
 */
export declare function createDefaultBlockRunnerStore(): IBlockRunnerFactoryStore;
/**
 * Main interface into this library.
 * @see README.md for usage details.
 */
export declare class FlowRunner implements IFlowRunner, IFlowNavigator, IPromptBuilder {
    /** Running context, JSON-serializable entity with enough information to start or resume a Flow. */
    context: IContext;
    /** Map of block types to a factory producting an IBlockRunner instnace. */
    runnerFactoryStore: IBlockRunnerFactoryStore;
    /** Instance used to `generate()` unique IDs across interaction history. */
    protected idGenerator: IIdGenerator;
    /** Instances providing isolated functionality beyond the default runner, leveraging built-in hooks. */
    behaviours: {
        [key: string]: IBehaviour;
    };
    _contextService: IContextService;
    constructor(context: IContext, runnerFactoryStore?: IBlockRunnerFactoryStore, idGenerator?: IIdGenerator, behaviours?: {
        [key: string]: IBehaviour;
    }, _contextService?: IContextService);
    /**
     * Take list of constructors and initialize them like: ```
     * runner.initializeBehaviours([MyFirstBehaviour, MySecondBehaviour])
     * runner.behaviours.myFirst instanceof MyFirstBehaviour
     * runner.behaviours.mySecond instanceof MySecondBehaviour
     * ``` */
    initializeBehaviours(behaviourConstructors: IBehaviourConstructor[]): void;
    /**
     * Initialize entry point into this flow run; typically called internally.
     * Sets up first block, engages run state and entry timestamp on context.
     */
    initialize(): Promise<IRichCursor | undefined>;
    /**
     * Verify whether or not we have a pointer in interaction history or not.
     * This identifies whether or not a run is in progress.
     * @param ctx
     */
    isInitialized(ctx: IContext): ctx is IContextWithCursor;
    /**
     * Decipher whether or not cursor points to the first interactive block or not.
     */
    isFirst(): boolean;
    /**
     * Decipher whether or not cursor points to the last block from interaction history.
     */
    isLast(): boolean;
    /**
     * Either begin or a resume a flow run, leveraging context instance member.
     */
    run(): Promise<IRichCursorInputRequired | undefined>;
    /**
     * Decipher whether or not calling run() will be able to proceed or our cursor's prompt is in an invalid state.
     * @param ctx
     */
    isInputRequiredFor(ctx: IContext): boolean;
    cacheInteractionByBlockName({ uuid, entry_at }: IBlockInteraction, { name, config: { prompt } }: IMessageBlock, context?: IContext): void;
    /**
     * Apply a mutation to `session_vars` and operations in both directions.
     * These vars are made available in content Expressions.
     * @param forward
     * @param reverse
     * @param context
     */
    applyReversibleDataOperation(forward: NonBreakingUpdateOperation, reverse: NonBreakingUpdateOperation, context?: IContext): void;
    /**
     * Pop last mutation to `session_vars` and apply its reversal operation.
     * @param context
     */
    reverseLastDataOperation(context?: IContext): IReversibleUpdateOperation | undefined;
    /**
     * Pushes onward through the flow when cursor's prompt has been fulfilled and there are blocks to draw from.
     * This will continue running blocks until an interactive block is encountered and input is required from
     * the IContact.
     * Typically called internally.
     * @param ctx
     */
    runUntilInputRequiredFrom(ctx: IContextWithCursor): Promise<IRichCursorInputRequired | undefined>;
    /**
     * Close off last interaction, push context status to complete, and write out exit timestamp.
     * Typically called internally.
     * @param ctx
     * @param completedAt
     */
    complete(ctx: IContext, completedAt?: Date): void;
    /**
     * Seal up an [[IBlockInteraction]] with a timestamp once we've selected an exit.
     * @param intx
     * @param selectedExitId
     * @param completedAt
     */
    completeInteraction(intx: IBlockInteraction, selectedExitId: IBlockExit['uuid'], completedAt?: Date): IBlockInteraction;
    /**
     * Seal up an interaction with an [[IRunFlowBlock]] which spans multiple child [[IBlockInteraction]]s.
     * This will apply a timestamp to parent [[IRunFlowBlock]]'s [[IBlockInteraction]], unnest active flow one level
     * and return the interaction for that parent [[IRunFlowBlock]].
     * @param ctx
     * @param completedAt
     */
    completeActiveNestedFlow(ctx: IContext, completedAt?: Date): IBlockInteraction;
    /**
     * Take a richCursor down to the bare minimum for JSON-serializability.
     * interaction IBlockInteraction reduced to its UUID
     * prompt IPrompt reduced to its raw config object.
     * Reverse of `hydrateRichCursorFrom()`.
     * @param richCursor
     */
    dehydrateCursor(richCursor: IRichCursor): ICursor;
    /**
     * Take raw cursor off an `IContext` and generate a richer, more detailed version; typically not JSON-serializable.
     * interactionId string UUID becomes full IBlockInteraction data object
     * promptConfig IPromptConfig becomes full-fledged Prompt instance corresponding to `kind`.
     * Reverse of `dehydrateCursor()`.
     * @param ctx
     */
    hydrateRichCursorFrom(ctx: IContextWithCursor): IRichCursor;
    /**
     * Generate an IBlockInteraction, apply `postInteractionCreate()` hooks over it,
     * generate cursor with full-fledged prompt.
     * @param block
     * @param flowId
     * @param originFlowId
     * @param originBlockInteractionId
     */
    initializeOneBlock(block: IBlock, flowId: string, originFlowId?: string, originBlockInteractionId?: string): Promise<IRichCursor>;
    /**
     * Type guard providing insight into whether or not prompt presence can be relied upon.
     * @param richCursor
     */
    isRichCursorInputRequired(richCursor: IRichCursor): richCursor is IRichCursorInputRequired;
    /**
     * Apply prompt value onto IBlockInteraction, complete IBlockRunner execution, mark prompt as having been submitted,
     * apply `postInteractionComplete()` hooks over it, and return IBlockRunner's selected exit.
     * @param richCursor
     * @param block
     */
    runActiveBlockOn(richCursor: IRichCursor, block: IBlock): Promise<IBlockExit>;
    /**
     * Produce an IBlockRunner instance leveraging `runnerFactoryStore` and `IBlock.type`.
     * Raises when `ValidationException` when not found.
     * @param block
     * @param ctx
     */
    createBlockRunnerFor(block: IBlock, ctx: IContext): IBlockRunner;
    /**
     * Initialize a block, close off any open past interaction, push newly initialized interaction onto history stack
     * and apply new cursor onto context.
     * @param block
     * @param ctx
     */
    navigateTo(block: IBlock, ctx: IContext): Promise<IRichCursor>;
    _activateCursorOnto(ctx: IContext, richCursor: IRichCursor): void;
    _inflateInteractionAndContainerCursorFor(block: IBlock, ctx: IContext): Promise<IRichCursor>;
    /**
     * Stepping into is the act of moving into a child flow.
     * However, we can't move into a child flow without a cursor indicating we've moved.
     * `stepInto()` needs to be the thing that discovers ya from xa (via first on flow in flows list)
     * Then generating a cursor that indicates where we are.
     * ?? -> xa ->>> ya -> yb ->>> xb
     *
     * todo: would it be possible for stepping into and out of be handled by the RunFlow itself?
     *       Eg. these are esentially RunFlowRunner's .start() + .resume() equivalents */
    stepInto(runFlowBlock: IBlock, ctx: IContext): IBlock | undefined;
    /**
     * Stepping out is the act of moving back into parent flow.
     * However, we can't move up into parent flow without a cursor indicating we've moved.
     * `stepOut()` needs to be the things that discovers xb from xa (via nfbistack)
     * Then generating a cursor that indicates where we are.
     * ?? -> xa ->>> ya -> yb ->>> xb
     *
     * @note Does this push cursor into an out-of-sync state?
     *       Not when stepping out, because when stepping out, we're connecting previous RunFlow output
     *       to next block; when stepping IN, we need an explicit navigation to inject RunFlow in between
     *       the two Flows. */
    stepOut(ctx: IContext): IBlock | undefined;
    findFirstExitOnActiveFlowBlockFor({ block_id }: IBlockInteraction, ctx: IContext): IBlockExit;
    /**
     * Find the active flow, then return first block on that flow if we've yet to initialize,
     * otherwise leverage current interaction's selected exit pointer.
     * @param ctx
     */
    findNextBlockOnActiveFlowFor(ctx: IContext): IBlock | undefined;
    /**
     * Find next block leveraging destinationBlock on current interaction's `selectedExit`.
     * Raises when `selectedExitId` absent.
     * @param block_id
     * @param selectedExitId
     * @param ctx
     */
    findNextBlockFrom({ block_id, selected_exit_id }: IBlockInteraction, ctx: IContext): IBlock | undefined;
    /**
     * Generate a concrete `IBlockInteraction` data object, pre-populated with:
     * - UUID via `IIdGenerator.generate()`
     * - entryAt via current timestamp
     * - flowId (provisioned)
     * - block_id via block.uuid
     * - type via block.type provisioned
     * - hasResponse as `false`
     * @param block_id
     * @param type
     * @param flowId
     * @param originFlowId
     * @param originBlockInteractionId
     */
    private createBlockInteractionFor;
    _inflatePromptForBlockOnto(richCursor: IRichCursor, block: IBlock, ctx: IContextWithCursor): Promise<void>;
    /**
     * Build a prompt using block's corresponding `IBlockRunner.initialize()` configurator and promptKeyToPromptConstructorMap() to
     * discover prompt constructor.
     * @param block
     * @param interaction
     */
    buildPromptFor(block: IBlock, interaction: IBlockInteraction): Promise<TGenericPrompt | undefined>;
    /**
     * New up prompt instance from an IPromptConfig, assuming kind exists in `promptKeyToPromptConstructorMap()`,
     * resulting in null when either config or interaction are absent.
     * @param config
     * @param interaction
     */
    createPromptFrom<T>(config?: IPromptConfig<T>, interaction?: IBlockInteraction): TGenericPrompt | undefined;
}
/**
 * Namespacing must be used, because otherwise, Builder can not be referenced, without resulting in a compiler error,
 * due to this not being able to resolve the FlowRunner.Builder type, because the Builder is transpiled to an object definition
 */
export declare namespace FlowRunner {
    class Builder {
        context?: IContext;
        runnerFactoryStore: BlockRunnerFactoryStore;
        idGenerator: IIdGenerator;
        behaviours: {
            [key: string]: IBehaviour;
        };
        _contextService: IContextService;
        setContext(context: IContext): FlowRunner.Builder;
        addBlockRunner(add: (store: BlockRunnerFactoryStore) => BlockRunnerFactoryStore): FlowRunner.Builder;
        setIdGenerator(idGenerator: IIdGenerator): FlowRunner.Builder;
        addBehaviour(behaviourKey: string, behaviour: IBehaviour): FlowRunner.Builder;
        addCustomPrompt<T extends IPromptConfig>(constructor: PromptConstructor<T>, promptKey: string): FlowRunner.Builder;
        build(): FlowRunner;
    }
}
//# sourceMappingURL=FlowRunner.d.ts.map