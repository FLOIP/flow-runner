import { NonBreakingUpdateOperation } from 'sp2';
import IBlock from '../flow-spec/IBlock';
import IContext, { IContextService, IContextWithCursor, ICursor, IReversibleUpdateOperation, IRichCursor, IRichCursorInputRequired } from '../flow-spec/IContext';
import IBlockRunner from './runners/IBlockRunner';
import IBlockInteraction from '../flow-spec/IBlockInteraction';
import IBlockExit from '../flow-spec/IBlockExit';
import IFlowRunner, { IBlockRunnerFactoryStore, TBlockRunnerFactory } from './IFlowRunner';
import IIdGenerator from './IIdGenerator';
import { IPromptConfig } from './prompt/IPrompt';
import MessagePrompt from './prompt/MessagePrompt';
import NumericPrompt from './prompt/NumericPrompt';
import OpenPrompt from './prompt/OpenPrompt';
import SelectOnePrompt from './prompt/SelectOnePrompt';
import SelectManyPrompt from './prompt/SelectManyPrompt';
import IBehaviour, { IBehaviourConstructor } from './behaviours/IBehaviour';
import IMessageBlock from '../model/block/IMessageBlock';
import { TGenericPrompt } from './prompt/BasePrompt';
import ReadPrompt from './prompt/ReadPrompt';
export declare class BlockRunnerFactoryStore extends Map<string, TBlockRunnerFactory> implements IBlockRunnerFactoryStore {
}
export interface IFlowNavigator {
    navigateTo(block: IBlock, ctx: IContext): IRichCursor;
}
export interface IPromptBuilder {
    buildPromptFor(block: IBlock, interaction: IBlockInteraction): TGenericPrompt | undefined;
}
export declare const NON_INTERACTIVE_BLOCK_TYPES: string[];
export declare function createDefaultBlockRunnerStore(): IBlockRunnerFactoryStore;
export declare function createKindPromptMap(): {
    [x: string]: typeof MessagePrompt | typeof NumericPrompt | typeof OpenPrompt | typeof SelectOnePrompt | typeof SelectManyPrompt | typeof ReadPrompt;
};
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
    complete(ctx: IContext): void;
    dehydrateCursor(richCursor: IRichCursor): ICursor;
    hydrateRichCursorFrom(ctx: IContextWithCursor): IRichCursor;
    initializeOneBlock(block: IBlock, flowId: string, originFlowId?: string, originBlockInteractionId?: string): IRichCursor;
    runActiveBlockOn(richCursor: IRichCursor, block: IBlock): Promise<IBlockExit>;
    createBlockRunnerFor(block: IBlock, ctx: IContext): IBlockRunner;
    navigateTo(block: IBlock, ctx: IContext, navigatedAt?: Date): IRichCursor;
    stepInto(runFlowBlock: IBlock, ctx: IContext): IBlock | undefined;
    stepOut(ctx: IContext): IBlock | undefined;
    findInteractionForActiveNestedFlow({ nestedFlowBlockInteractionIdStack, interactions }: IContext): IBlockInteraction;
    findNextBlockOnActiveFlowFor(ctx: IContext): IBlock | undefined;
    findNextBlockFrom({ blockId, selectedExitId }: IBlockInteraction, ctx: IContext): IBlock | undefined;
    private createBlockInteractionFor;
    buildPromptFor(block: IBlock, interaction: IBlockInteraction): TGenericPrompt | undefined;
    createPromptFrom(config?: IPromptConfig<any>, interaction?: IBlockInteraction): TGenericPrompt | undefined;
}
export default FlowRunner;
//# sourceMappingURL=FlowRunner.d.ts.map