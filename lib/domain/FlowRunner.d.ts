import IBlock from '../flow-spec/IBlock';
import IContext, { CursorType, IContextWithCursor, RichCursorInputRequiredType, RichCursorType } from '../flow-spec/IContext';
import IBlockRunner from './runners/IBlockRunner';
import IBlockInteraction from '../flow-spec/IBlockInteraction';
import IBlockExit from '../flow-spec/IBlockExit';
import IFlowRunner, { IBlockRunnerFactoryStore } from './IFlowRunner';
export declare class BlockRunnerFactoryStore extends Map<string, {
    (block: IBlock): IBlockRunner;
}> implements IBlockRunnerFactoryStore {
}
export default class implements IFlowRunner {
    context: IContext;
    runnerFactoryStore: IBlockRunnerFactoryStore;
    constructor(context: IContext, runnerFactoryStore: IBlockRunnerFactoryStore);
    initialize(): RichCursorType | undefined;
    isInitialized(ctx: IContext): boolean;
    run(): RichCursorInputRequiredType | undefined;
    isInputRequiredFor(ctx: IContext): false | boolean;
    runUntilInputRequiredFrom(ctx: IContextWithCursor): RichCursorInputRequiredType | undefined;
    complete(ctx: IContext): void;
    dehydrateCursor(richCursor: RichCursorType): CursorType;
    hydrateRichCursorFrom(ctx: IContextWithCursor): RichCursorType;
    initializeOneBlock(block: IBlock, flowId: string, originFlowId?: string, originBlockInteractionId?: string): RichCursorType;
    runActiveBlockOn(richCursor: RichCursorType, block: IBlock): IBlockExit;
    createBlockRunnerFor(block: IBlock): IBlockRunner;
    navigateTo(block: IBlock, ctx: IContext): RichCursorType;
    stepInto(runFlowBlock: IBlock, ctx: IContext): IBlock | undefined;
    stepOut(ctx: IContext): IBlock | undefined;
    findNextBlockOnActiveFlowFor(ctx: IContext): IBlock | undefined;
    findNextBlockFrom(interaction: IBlockInteraction, ctx: IContext): IBlock | undefined;
    private createBlockInteractionFor;
    private createBlockExitFor;
    private createPromptFrom;
}
//# sourceMappingURL=FlowRunner.d.ts.map