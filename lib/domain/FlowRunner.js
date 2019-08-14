"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IBlock_1 = require("../flow-spec/IBlock");
const IContext_1 = require("../flow-spec/IContext");
const lodash_1 = require("lodash");
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const ValidationException_1 = tslib_1.__importDefault(require("./exceptions/ValidationException"));
const NumericPrompt_1 = tslib_1.__importDefault(require("./prompt/NumericPrompt"));
class BlockRunnerFactoryStore extends Map {
}
exports.BlockRunnerFactoryStore = BlockRunnerFactoryStore;
class default_1 {
    constructor(context, runnerFactoryStore) {
        this.context = context;
        this.runnerFactoryStore = runnerFactoryStore;
    }
    initialize() {
        const block = this.findNextBlockOnActiveFlowFor(this.context);
        if (!block) {
            throw new ValidationException_1.default('Unable to initialize flow without blocks.');
        }
        return this.navigateTo(block, this.context);
    }
    isInitialized(ctx) {
        return !!ctx.cursor;
    }
    run() {
        const { context: ctx } = this;
        if (!this.isInitialized(ctx)) {
            this.initialize();
        }
        return this.runUntilInputRequiredFrom(ctx);
    }
    isInputRequiredFor(ctx) {
        return (ctx.cursor
            && ctx.cursor[1]
            && !ctx.cursor[1].isSubmitted);
    }
    runUntilInputRequiredFrom(ctx) {
        let richCursor = this.hydrateRichCursorFrom(ctx), block = IContext_1.findBlockOnActiveFlowWith(richCursor[0].blockId, ctx);
        do {
            if (this.isInputRequiredFor(ctx)) {
                console.log('Attempted to resume when prompt is not yet fulfilled; resurfacing same prompt instance.');
                return richCursor;
            }
            this.runActiveBlockOn(richCursor, block);
            block = this.findNextBlockOnActiveFlowFor(ctx);
            if (!block) {
                block = this.stepOut(ctx);
            }
            if (!block) {
                continue;
            }
            if (block.type === 'Core\\RunFlowBlock') {
                richCursor = this.navigateTo(block, ctx);
                block = this.stepInto(block, ctx);
            }
            if (!block) {
                continue;
            }
            richCursor = this.navigateTo(block, ctx);
        } while (block);
        this.complete(ctx);
        return null;
    }
    exitEarlyThrough(block) {
    }
    complete(ctx) {
        lodash_1.last(ctx.interactions).exitAt = new Date;
        delete ctx.cursor;
    }
    dehydrateCursor(richCursor) {
        return [richCursor[0].uuid, richCursor[1] ? richCursor[1].config : null];
    }
    hydrateRichCursorFrom(ctx) {
        const { cursor } = ctx;
        return [IContext_1.findInteractionWith(cursor[0], ctx), this._createPromptFrom(cursor[1])];
    }
    initializeOneBlock(block, flowId, originFlowId, originBlockInteractionId) {
        const runner = this.createBlockRunnerFor(block), interaction = this._createBlockInteractionFor(block, flowId, originFlowId, originBlockInteractionId), promptConfig = runner.initialize(interaction), prompt = this._createPromptFrom(promptConfig);
        return [interaction, prompt];
    }
    runActiveBlockOn(richCursor, block) {
        if (richCursor[1]) {
            richCursor[0].value = richCursor[1].value;
        }
        const exit = this.createBlockRunnerFor(block)
            .run(richCursor);
        richCursor[0].details.selectedExitId = exit.uuid;
        if (richCursor[1]) {
            richCursor[1].config.isSubmitted = true;
        }
        return exit;
    }
    createBlockRunnerFor(block) {
        const factory = this.runnerFactoryStore.get(block.type);
        if (!factory) {
            throw new ValidationException_1.default(`Unable to find factory for block type: ${block.type}`);
        }
        return factory(block);
    }
    _createBlockInteractionFor({ uuid: blockId }, flowId, originFlowId = null, originBlockInteractionId = null) {
        return {
            uuid: uuid_1.default.v4(),
            blockId,
            flowId,
            entryAt: new Date,
            exitAt: null,
            hasResponse: false,
            value: null,
            details: { selectedExitId: null },
            type: null,
            originFlowId,
            originBlockInteractionId,
        };
    }
    _createBlockExitFor({ uuid: destination_block }) {
        return {
            uuid: uuid_1.default.v4(),
            destination_block,
            config: {},
            label: '',
            semantic_label: '',
            tag: '',
            test: ''
        };
    }
    _createPromptFrom(config) {
        if (!config) {
            return null;
        }
        return new NumericPrompt_1.default({}, {}, config);
    }
    navigateTo(block, ctx) {
        const { interactions, nestedFlowBlockInteractionIdStack } = ctx, flowId = IContext_1.getActiveFlowIdFrom(ctx), originInteractionId = lodash_1.last(nestedFlowBlockInteractionIdStack) || null, originInteraction = originInteractionId
            ? IContext_1.findInteractionWith(originInteractionId, ctx)
            : null;
        const richCursor = this.initializeOneBlock(block, flowId, originInteraction && originInteraction.flowId, originInteractionId);
        const lastInteraction = lodash_1.last(interactions);
        if (lastInteraction) {
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
        if (!runFlowInteraction) {
            throw new ValidationException_1.default('Unable to step into Core\\RunFlow that hasn\'t yet been started');
        }
        if (runFlowBlock.uuid !== runFlowInteraction.blockId) {
            throw new ValidationException_1.default('Unable to step into Core\\RunFlow block that doesn\'t match last interaction');
        }
        ctx.nestedFlowBlockInteractionIdStack.push(runFlowInteraction.uuid);
        const firstNestedBlock = lodash_1.first(IContext_1.getActiveFlowFrom(ctx).blocks) || null;
        if (!firstNestedBlock) {
            return null;
        }
        if (runFlowBlock.exits.length === 1) {
            runFlowBlock.exits.push(this._createBlockExitFor(firstNestedBlock));
        }
        runFlowInteraction.details.selectedExitId = lodash_1.last(runFlowBlock.exits).uuid;
        return firstNestedBlock;
    }
    stepOut(ctx) {
        const { interactions, nestedFlowBlockInteractionIdStack } = ctx;
        if (!nestedFlowBlockInteractionIdStack.length) {
            return null;
        }
        const lastParentInteractionId = nestedFlowBlockInteractionIdStack.pop(), { blockId: lastRunFlowBlockId } = IContext_1.findInteractionWith(lastParentInteractionId, ctx), lastRunFlowBlock = IContext_1.findBlockOnActiveFlowWith(lastRunFlowBlockId, ctx), { uuid: runFlowBlockFirstExitId, destination_block } = lodash_1.first(lastRunFlowBlock.exits);
        lodash_1.last(interactions).details.selectedExitId = runFlowBlockFirstExitId;
        return IContext_1.findBlockOnActiveFlowWith(destination_block, ctx);
    }
    findNextBlockOnActiveFlowFor(ctx) {
        const flow = IContext_1.getActiveFlowFrom(ctx), { cursor } = ctx;
        if (!cursor) {
            return lodash_1.first(flow.blocks) || null;
        }
        const interaction = IContext_1.findInteractionWith(cursor[0], ctx);
        return this.findNextBlockFrom(interaction, ctx);
    }
    findNextBlockFrom(interaction, ctx) {
        if (!interaction.details.selectedExitId) {
            throw new ValidationException_1.default('Unable to navigate past incomplete interaction; did you forget to call runner.run()?');
        }
        const block = IContext_1.findBlockOnActiveFlowWith(interaction.blockId, ctx), { destination_block } = IBlock_1.findBlockExitWith(interaction.details.selectedExitId, block), { blocks } = IContext_1.getActiveFlowFrom(ctx);
        return lodash_1.find(blocks, { uuid: destination_block }) || null;
    }
}
exports.default = default_1;
//# sourceMappingURL=FlowRunner.js.map