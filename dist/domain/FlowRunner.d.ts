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
export declare const NON_INTERACTIVE_BLOCK_TYPES: string[];
export declare function createDefaultBlockRunnerStore(): IBlockRunnerFactoryStore;
export declare class FlowRunner implements IFlowRunner, IFlowNavigator, IPromptBuilder {
    context: IContext;
    runnerFactoryStore: IBlockRunnerFactoryStore;
    protected idGenerator: IIdGenerator;
    behaviours: {
        [key: string]: IBehaviour;
    };
    _contextService: IContextService;
    constructor(context: IContext, runnerFactoryStore?: IBlockRunnerFactoryStore, idGenerator?: IIdGenerator, behaviours?: {
        [key: string]: IBehaviour;
    }, _contextService?: IContextService);
    initializeBehaviours(behaviourConstructors: IBehaviourConstructor[]): void;
    initialize(): Promise<IRichCursor | undefined>;
    isInitialized(ctx: IContext): boolean;
    isFirst(): boolean;
    isLast(): boolean;
    run(): Promise<IRichCursorInputRequired | undefined>;
    isInputRequiredFor(ctx: IContext): boolean;
    cacheInteractionByBlockName({ uuid, entryAt }: IBlockInteraction, { name, config: { prompt } }: IMessageBlock, context?: IContext): void;
    applyReversibleDataOperation(forward: NonBreakingUpdateOperation, reverse: NonBreakingUpdateOperation, context?: IContext): void;
    reverseLastDataOperation(context?: IContext): IReversibleUpdateOperation | undefined;
    runUntilInputRequiredFrom(ctx: IContextWithCursor): Promise<IRichCursorInputRequired | undefined>;
    complete(ctx: IContext, completedAt?: Date): void;
    completeInteraction(intx: IBlockInteraction, selectedExitId: IBlockExit['uuid'], completedAt?: Date): IBlockInteraction;
    completeActiveNestedFlow(ctx: IContext, completedAt?: Date): IBlockInteraction;
    dehydrateCursor(richCursor: IRichCursor): ICursor;
    hydrateRichCursorFrom(ctx: IContextWithCursor): IRichCursor;
    initializeOneBlock(block: IBlock, flowId: string, originFlowId?: string, originBlockInteractionId?: string): Promise<IRichCursor>;
    runActiveBlockOn(richCursor: IRichCursor, block: IBlock): Promise<IBlockExit>;
    createBlockRunnerFor(block: IBlock, ctx: IContext): IBlockRunner;
    navigateTo(block: IBlock, ctx: IContext): Promise<IRichCursor>;
    stepInto(runFlowBlock: IBlock, ctx: IContext): IBlock | undefined;
    stepOut(ctx: IContext): IBlock | undefined;
    findFirstExitOnActiveFlowBlockFor({ blockId }: IBlockInteraction, ctx: IContext): IBlockExit;
    findNextBlockOnActiveFlowFor(ctx: IContext): IBlock | undefined;
    findNextBlockFrom({ blockId, selectedExitId }: IBlockInteraction, ctx: IContext): IBlock | undefined;
    private createBlockInteractionFor;
    buildPromptFor(block: IBlock, interaction: IBlockInteraction): Promise<TGenericPrompt | undefined>;
    createPromptFrom<T>(config?: IPromptConfig<T>, interaction?: IBlockInteraction): TGenericPrompt | undefined;
    static Builder: {
        new (): {
            context?: IContext | undefined;
            runnerFactoryStore: BlockRunnerFactoryStore;
            idGenerator: IIdGenerator;
            behaviours: {
                [key: string]: IBehaviour;
            };
            _contextService: IContextService;
            setContext(context: IContext): this;
            addBlockRunner(add: (store: BlockRunnerFactoryStore) => BlockRunnerFactoryStore): this;
            setIdGenerator(idGenerator: IIdGenerator): this;
            addBehaviour(behaviourKey: string, behaviour: IBehaviour): this;
            addCustomPrompt<T>(constructor: PromptConstructor<T>, promptKey: string): this;
            build(): FlowRunner;
        };
    };
}
//# sourceMappingURL=FlowRunner.d.ts.map