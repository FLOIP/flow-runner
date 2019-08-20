"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IBlock_1 = require("../flow-spec/IBlock");
const IContext_1 = require("../flow-spec/IContext");
const lodash_1 = require("lodash");
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const ValidationException_1 = tslib_1.__importDefault(require("./exceptions/ValidationException"));
const MessagePrompt_1 = tslib_1.__importDefault(require("./prompt/MessagePrompt"));
const DeliveryStatus_1 = tslib_1.__importDefault(require("../flow-spec/DeliveryStatus"));
class BlockRunnerFactoryStore extends Map {
}
exports.BlockRunnerFactoryStore = BlockRunnerFactoryStore;
class default_1 {
    constructor(context, runnerFactoryStore) {
        this.context = context;
        this.runnerFactoryStore = runnerFactoryStore;
    }
    initialize() {
        const ctx = this.context;
        const block = this.findNextBlockOnActiveFlowFor(ctx);
        if (block == null) {
            throw new ValidationException_1.default('Unable to initialize flow without blocks.');
        }
        ctx.deliveryStatus = DeliveryStatus_1.default.IN_PROGRESS;
        ctx.entryAt = new Date;
        return this.navigateTo(block, this.context);
    }
    isInitialized(ctx) {
        return ctx.cursor != null;
    }
    run() {
        const { context: ctx } = this;
        if (!this.isInitialized(ctx)) {
            this.initialize();
        }
        return this.runUntilInputRequiredFrom(ctx);
    }
    isInputRequiredFor(ctx) {
        return ctx.cursor != null
            && ctx.cursor[1] != null
            && ctx.cursor[1].value === undefined;
    }
    runUntilInputRequiredFrom(ctx) {
        let richCursor = this.hydrateRichCursorFrom(ctx);
        let block = IContext_1.findBlockOnActiveFlowWith(richCursor[0].blockId, ctx);
        do {
            if (this.isInputRequiredFor(ctx)) {
                console.info('Attempted to resume when prompt is not yet fulfilled; resurfacing same prompt instance.');
                return richCursor;
            }
            this.runActiveBlockOn(richCursor, block);
            block = this.findNextBlockOnActiveFlowFor(ctx);
            if (block == null) {
                block = this.stepOut(ctx);
            }
            if (block == null) {
                continue;
            }
            if (block.type === 'Core\\RunFlowBlock') {
                richCursor = this.navigateTo(block, ctx);
                block = this.stepInto(block, ctx);
            }
            if (block == null) {
                continue;
            }
            richCursor = this.navigateTo(block, ctx);
        } while (block != null);
        this.complete(ctx);
    }
    complete(ctx) {
        lodash_1.last(ctx.interactions).exitAt = new Date;
        delete ctx.cursor;
        ctx.deliveryStatus = DeliveryStatus_1.default.FINISHED_COMPLETE;
        ctx.exitAt = new Date;
    }
    dehydrateCursor(richCursor) {
        return [richCursor[0].uuid, richCursor[1] != null ? richCursor[1].config : undefined];
    }
    hydrateRichCursorFrom(ctx) {
        const { cursor } = ctx;
        const interaction = IContext_1.findInteractionWith(cursor[0], ctx);
        return [interaction, this.createPromptFrom(cursor[1], interaction)];
    }
    initializeOneBlock(block, flowId, originFlowId, originBlockInteractionId) {
        const runner = this.createBlockRunnerFor(block);
        const interaction = this.createBlockInteractionFor(block, flowId, originFlowId, originBlockInteractionId);
        const promptConfig = runner.initialize(interaction);
        const prompt = this.createPromptFrom(promptConfig, interaction);
        return [interaction, prompt];
    }
    runActiveBlockOn(richCursor, block) {
        if (richCursor[1] != null) {
            richCursor[0].value = richCursor[1].value;
        }
        const exit = this.createBlockRunnerFor(block)
            .run(richCursor);
        richCursor[0].details.selectedExitId = exit.uuid;
        if (richCursor[1] != null) {
            richCursor[1].config.isSubmitted = true;
        }
        return exit;
    }
    createBlockRunnerFor(block) {
        const factory = this.runnerFactoryStore.get(block.type);
        if (factory == null) {
            throw new ValidationException_1.default(`Unable to find factory for block type: ${block.type}`);
        }
        return factory(block);
    }
    navigateTo(block, ctx) {
        const { interactions, nestedFlowBlockInteractionIdStack } = ctx;
        const flowId = IContext_1.getActiveFlowIdFrom(ctx);
        const originInteractionId = lodash_1.last(nestedFlowBlockInteractionIdStack);
        const originInteraction = originInteractionId != null
            ? IContext_1.findInteractionWith(originInteractionId, ctx)
            : null;
        const richCursor = this.initializeOneBlock(block, flowId, originInteraction == null ? undefined : originInteraction.flowId, originInteractionId);
        const lastInteraction = lodash_1.last(interactions);
        if (lastInteraction != null) {
            lastInteraction.exitAt = new Date;
        }
        interactions.push(richCursor[0]);
        ctx.cursor = this.dehydrateCursor(richCursor);
        return richCursor;
    }
    stepInto(runFlowBlock, ctx) {
        if (runFlowBlock.type !== 'Core\\RunFlow') {
            throw new ValidationException_1.default('Unable to step into a non-Core\\RunFlow block type');
        }
        const runFlowInteraction = lodash_1.last(ctx.interactions);
        if (runFlowInteraction == null) {
            throw new ValidationException_1.default('Unable to step into Core\\RunFlow that hasn\'t yet been started');
        }
        if (runFlowBlock.uuid !== runFlowInteraction.blockId) {
            throw new ValidationException_1.default('Unable to step into Core\\RunFlow block that doesn\'t match last interaction');
        }
        ctx.nestedFlowBlockInteractionIdStack.push(runFlowInteraction.uuid);
        const firstNestedBlock = lodash_1.first(IContext_1.getActiveFlowFrom(ctx).blocks);
        if (firstNestedBlock == null) {
            return undefined;
        }
        if (runFlowBlock.exits.length === 1) {
            runFlowBlock.exits.push(this.createBlockExitFor(firstNestedBlock));
        }
        runFlowInteraction.details.selectedExitId = lodash_1.last(runFlowBlock.exits).uuid;
        return firstNestedBlock;
    }
    stepOut(ctx) {
        const { interactions, nestedFlowBlockInteractionIdStack } = ctx;
        if (nestedFlowBlockInteractionIdStack.length === 0) {
            return;
        }
        const lastParentInteractionId = nestedFlowBlockInteractionIdStack.pop();
        const { blockId: lastRunFlowBlockId } = IContext_1.findInteractionWith(lastParentInteractionId, ctx);
        const lastRunFlowBlock = IContext_1.findBlockOnActiveFlowWith(lastRunFlowBlockId, ctx);
        const { uuid: runFlowBlockFirstExitId, destinationBlock } = lodash_1.first(lastRunFlowBlock.exits);
        lodash_1.last(interactions).details.selectedExitId = runFlowBlockFirstExitId;
        if (destinationBlock == null) {
            return;
        }
        return IContext_1.findBlockOnActiveFlowWith(destinationBlock, ctx);
    }
    findNextBlockOnActiveFlowFor(ctx) {
        const flow = IContext_1.getActiveFlowFrom(ctx);
        const { cursor } = ctx;
        if (cursor == null) {
            return lodash_1.first(flow.blocks);
        }
        const interaction = IContext_1.findInteractionWith(cursor[0], ctx);
        return this.findNextBlockFrom(interaction, ctx);
    }
    findNextBlockFrom(interaction, ctx) {
        if (interaction.details.selectedExitId == null) {
            throw new ValidationException_1.default('Unable to navigate past incomplete interaction; did you forget to call runner.run()?');
        }
        const block = IContext_1.findBlockOnActiveFlowWith(interaction.blockId, ctx);
        const { destinationBlock } = IBlock_1.findBlockExitWith(interaction.details.selectedExitId, block);
        const { blocks } = IContext_1.getActiveFlowFrom(ctx);
        return lodash_1.find(blocks, { uuid: destinationBlock });
    }
    createBlockInteractionFor({ uuid: blockId }, flowId, originFlowId, originBlockInteractionId) {
        return {
            uuid: uuid_1.default.v4(),
            blockId,
            flowId,
            entryAt: new Date,
            exitAt: undefined,
            hasResponse: false,
            value: undefined,
            details: { selectedExitId: null },
            type: null,
            originFlowId,
            originBlockInteractionId,
        };
    }
    createBlockExitFor({ uuid: destinationBlock }) {
        return {
            uuid: uuid_1.default.v4(),
            destinationBlock: destinationBlock,
            config: {},
            label: '',
            semanticLabel: '',
            tag: '',
            test: '',
        };
    }
    createPromptFrom(config, interaction) {
        if (config == null || interaction == null) {
            return;
        }
        return new MessagePrompt_1.default(config, interaction.uuid);
    }
}
exports.default = default_1;
//# sourceMappingURL=FlowRunner.js.map