import IBlock from "../flow-spec/IBlock";
import IContext, { CursorType, IContextWithCursor, RichCursorInputRequiredType, RichCursorType } from "../flow-spec/IContext";
import IBlockRunner from "./runners/IBlockRunner";
import IBlockInteraction from "../flow-spec/IBlockInteraction";
import IBlockExit from "../flow-spec/IBlockExit";
import IFlowRunner, { IBlockRunnerFactoryStore } from "./IFlowRunner";
import IPrompt, { IBasePromptConfig, IPromptConfig } from "./prompt/IPrompt";
export declare class BlockRunnerFactoryStore extends Map<string, {
    (block: IBlock): IBlockRunner;
}> implements IBlockRunnerFactoryStore {
}
export default class implements IFlowRunner {
    context: IContext;
    runnerFactoryStore: IBlockRunnerFactoryStore;
    constructor(context: IContext, runnerFactoryStore: IBlockRunnerFactoryStore);
    initialize(): RichCursorType | null;
    isInitialized(ctx: IContext): boolean;
    run(): RichCursorInputRequiredType | null;
    isInputRequiredFor(ctx: IContext): boolean;
    runUntilInputRequiredFrom(ctx: IContextWithCursor): RichCursorInputRequiredType | null;
    exitEarlyThrough(block: IBlock): void;
    complete(ctx: IContext): void;
    dehydrateCursor(richCursor: RichCursorType): CursorType;
    hydrateRichCursorFrom(ctx: IContextWithCursor): RichCursorType;
    initializeOneBlock(block: IBlock, flowId: string, originFlowId: string | null, originBlockInteractionId: string | null): RichCursorType;
    runActiveBlockOn(richCursor: RichCursorType, block: IBlock): IBlockExit;
    createBlockRunnerFor(block: IBlock): IBlockRunner;
    _createBlockInteractionFor({ uuid: blockId }: IBlock, flowId: string, originFlowId?: string | null, originBlockInteractionId?: string | null): IBlockInteraction;
    _createBlockExitFor({ uuid: destination_block }: IBlock): IBlockExit;
    _createPromptFrom(config: IPromptConfig<any> | null): IPrompt<IPromptConfig<any> & IBasePromptConfig> | null;
    navigateTo(block: IBlock, ctx: IContext): RichCursorType;
    stepInto(runFlowBlock: IBlock, ctx: IContext): IBlock | null;
    stepOut(ctx: IContext): IBlock | null;
    findNextBlockOnActiveFlowFor(ctx: IContext): IBlock | null;
    findNextBlockFrom(interaction: IBlockInteraction, ctx: IContext): IBlock | null;
}
//# sourceMappingURL=FlowRunner.d.ts.map