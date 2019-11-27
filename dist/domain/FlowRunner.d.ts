import IBlock from '../flow-spec/IBlock';
import IContext, { CursorType, IContextWithCursor, RichCursorInputRequiredType, RichCursorType } from '../flow-spec/IContext';
import IBlockRunner from './runners/IBlockRunner';
import IBlockInteraction from '../flow-spec/IBlockInteraction';
import IBlockExit from '../flow-spec/IBlockExit';
import IFlowRunner, { IBlockRunnerFactoryStore } from './IFlowRunner';
import IIdGenerator from './IIdGenerator';
import IPrompt, { IBasePromptConfig, IPromptConfig } from './prompt/IPrompt';
import IBehaviour, { IBehaviourConstructor } from './behaviours/IBehaviour';
export declare class BlockRunnerFactoryStore extends Map<string, {
    (block: IBlock, ctx: IContext): IBlockRunner;
}> implements IBlockRunnerFactoryStore {
}
export interface IFlowNavigator {
    navigateTo(block: IBlock, ctx: IContext): RichCursorType;
}
export interface IPromptBuilder {
    buildPromptFor(block: IBlock, interaction: IBlockInteraction): IPrompt<IPromptConfig<any> & IBasePromptConfig> | undefined;
}
export declare const NON_INTERACTIVE_BLOCK_TYPES: string[];
export declare enum BLOCK_TYPES {
    Message = "MobilePrimitives\\Message",
    OpenResponse = "MobilePrimitives\\OpenResponse",
    NumericResponse = "MobilePrimitives\\NumericResponse",
    SelectOneResponse = "MobilePrimitives\\SelectOneResponse",
    SelectManyResponse = "MobilePrimitives\\SelectManyResponse",
    Case = "Core\\Case",
    SetContactProperty = "Core\\SetContactProperty"
}
export declare function createDefaultBlockRunnerStore(): IBlockRunnerFactoryStore;
export default class FlowRunner implements IFlowRunner, IFlowNavigator, IPromptBuilder {
    context: IContext;
    runnerFactoryStore: IBlockRunnerFactoryStore;
    protected idGenerator: IIdGenerator;
    behaviours: {
        [key: string]: IBehaviour;
    };
    constructor(context: IContext, runnerFactoryStore?: IBlockRunnerFactoryStore, idGenerator?: IIdGenerator, behaviours?: {
        [key: string]: IBehaviour;
    });
    initializeBehaviours(behaviourConstructors: IBehaviourConstructor[]): void;
    initialize(): RichCursorType | undefined;
    isInitialized(ctx: IContext): boolean;
    isFirst(): boolean;
    isLast(): boolean;
    run(): RichCursorInputRequiredType | undefined;
    isInputRequiredFor(ctx: IContext): boolean;
    runUntilInputRequiredFrom(ctx: IContextWithCursor): RichCursorInputRequiredType | undefined;
    complete(ctx: IContext): void;
    dehydrateCursor(richCursor: RichCursorType): CursorType;
    hydrateRichCursorFrom(ctx: IContextWithCursor): RichCursorType;
    initializeOneBlock(block: IBlock, flowId: string, originFlowId?: string, originBlockInteractionId?: string): RichCursorType;
    runActiveBlockOn(richCursor: RichCursorType, block: IBlock): IBlockExit;
    createBlockRunnerFor(block: IBlock, ctx: IContext): IBlockRunner;
    navigateTo(block: IBlock, ctx: IContext, navigatedAt?: Date): RichCursorType;
    stepInto(runFlowBlock: IBlock, ctx: IContext): IBlock | undefined;
    stepOut(ctx: IContext): IBlock | undefined;
    findNextBlockOnActiveFlowFor(ctx: IContext): IBlock | undefined;
    findNextBlockFrom(interaction: IBlockInteraction, ctx: IContext): IBlock | undefined;
    private createBlockInteractionFor;
    buildPromptFor(block: IBlock, interaction: IBlockInteraction): IPrompt<IPromptConfig<any> & IBasePromptConfig> | undefined;
    private createPromptFrom;
}
//# sourceMappingURL=FlowRunner.d.ts.map