"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const IBlock_1 = require("../flow-spec/IBlock");
const IContext_1 = require("../flow-spec/IContext");
const lodash_2 = require("lodash");
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const IdGeneratorUuidV4_1 = tslib_1.__importDefault(require("./IdGeneratorUuidV4"));
const ValidationException_1 = tslib_1.__importDefault(require("./exceptions/ValidationException"));
const IPrompt_1 = require("./prompt/IPrompt");
const MessagePrompt_1 = tslib_1.__importDefault(require("./prompt/MessagePrompt"));
const DeliveryStatus_1 = tslib_1.__importDefault(require("../flow-spec/DeliveryStatus"));
const NumericPrompt_1 = tslib_1.__importDefault(require("./prompt/NumericPrompt"));
const OpenPrompt_1 = tslib_1.__importDefault(require("./prompt/OpenPrompt"));
const SelectOnePrompt_1 = tslib_1.__importDefault(require("./prompt/SelectOnePrompt"));
const SelectManyPrompt_1 = tslib_1.__importDefault(require("./prompt/SelectManyPrompt"));
const BacktrackingBehaviour_1 = tslib_1.__importDefault(require("./behaviours/BacktrackingBehaviour/BacktrackingBehaviour"));
class BlockRunnerFactoryStore extends Map {
}
exports.BlockRunnerFactoryStore = BlockRunnerFactoryStore;
const DEFAULT_BEHAVIOUR_TYPES = [
    BacktrackingBehaviour_1.default,
];
exports.NON_INTERACTIVE_BLOCK_TYPES = [
    'Core\\Case',
    'Core\\RunFlowBlock',
];
class FlowRunner {
    constructor(context, runnerFactoryStore, idGenerator = new IdGeneratorUuidV4_1.default(), behaviours = {}) {
        this.context = context;
        this.runnerFactoryStore = runnerFactoryStore;
        this.idGenerator = idGenerator;
        this.behaviours = behaviours;
        this.initializeBehaviours(DEFAULT_BEHAVIOUR_TYPES);
    }
    initializeBehaviours(behaviourConstructors) {
        behaviourConstructors.forEach(b => this.behaviours[lodash_1.lowerFirst(lodash_1.trimEnd(b.name, 'Behaviour|Behavior'))]
            = new b(this.context, this, this));
    }
    initialize() {
        const ctx = this.context;
        const block = this.findNextBlockOnActiveFlowFor(ctx);
        if (block == null) {
            throw new ValidationException_1.default('Unable to initialize flow without blocks.');
        }
        ctx.deliveryStatus = DeliveryStatus_1.default.IN_PROGRESS;
        ctx.entryAt = new Date().toISOString();
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
        return;
    }
    complete(ctx) {
        lodash_2.last(ctx.interactions).exitAt = new Date().toISOString();
        delete ctx.cursor;
        ctx.deliveryStatus = DeliveryStatus_1.default.FINISHED_COMPLETE;
        ctx.exitAt = new Date().toISOString();
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
        let interaction = this.createBlockInteractionFor(block, flowId, originFlowId, originBlockInteractionId);
        Object.values(this.behaviours).forEach(b => interaction = b.postInteractionCreate(interaction, this.context));
        return [interaction, this.buildPromptFor(block, interaction)];
    }
    runActiveBlockOn(richCursor, block) {
        if (richCursor[1] != null) {
            richCursor[0].value = richCursor[1].value;
            richCursor[0].hasResponse = true;
        }
        const exit = this.createBlockRunnerFor(block, this.context)
            .run(richCursor);
        richCursor[0].details.selectedExitId = exit.uuid;
        if (richCursor[1] != null) {
            richCursor[1].config.isSubmitted = true;
        }
        Object.values(this.behaviours).forEach(b => b.postInteractionComplete(richCursor[0], this.context));
        return exit;
    }
    createBlockRunnerFor(block, ctx) {
        const factory = this.runnerFactoryStore.get(block.type);
        if (factory == null) {
            throw new ValidationException_1.default(`Unable to find factory for block type: ${block.type}`);
        }
        return factory(block, ctx);
    }
    navigateTo(block, ctx) {
        const { interactions, nestedFlowBlockInteractionIdStack } = ctx;
        const flowId = IContext_1.getActiveFlowIdFrom(ctx);
        const originInteractionId = lodash_2.last(nestedFlowBlockInteractionIdStack);
        const originInteraction = originInteractionId != null
            ? IContext_1.findInteractionWith(originInteractionId, ctx)
            : null;
        const richCursor = this.initializeOneBlock(block, flowId, originInteraction == null ? undefined : originInteraction.flowId, originInteractionId);
        const lastInteraction = lodash_2.last(interactions);
        if (lastInteraction != null) {
            lastInteraction.exitAt = new Date().toISOString();
        }
        interactions.push(richCursor[0]);
        ctx.cursor = this.dehydrateCursor(richCursor);
        return richCursor;
    }
    stepInto(runFlowBlock, ctx) {
        if (runFlowBlock.type !== 'Core\\RunFlow') {
            throw new ValidationException_1.default('Unable to step into a non-Core\\RunFlow block type');
        }
        const runFlowInteraction = lodash_2.last(ctx.interactions);
        if (runFlowInteraction == null) {
            throw new ValidationException_1.default('Unable to step into Core\\RunFlow that hasn\'t yet been started');
        }
        if (runFlowBlock.uuid !== runFlowInteraction.blockId) {
            throw new ValidationException_1.default('Unable to step into Core\\RunFlow block that doesn\'t match last interaction');
        }
        ctx.nestedFlowBlockInteractionIdStack.push(runFlowInteraction.uuid);
        const firstNestedBlock = lodash_2.first(IContext_1.getActiveFlowFrom(ctx).blocks);
        if (firstNestedBlock == null) {
            return undefined;
        }
        if (runFlowBlock.exits.length === 1) {
            runFlowBlock.exits.push(this.createBlockExitFor(firstNestedBlock));
        }
        runFlowInteraction.details.selectedExitId = lodash_2.last(runFlowBlock.exits).uuid;
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
        const { uuid: runFlowBlockFirstExitId, destinationBlock } = lodash_2.first(lastRunFlowBlock.exits);
        lodash_2.last(interactions).details.selectedExitId = runFlowBlockFirstExitId;
        if (destinationBlock == null) {
            return;
        }
        return IContext_1.findBlockOnActiveFlowWith(destinationBlock, ctx);
    }
    findNextBlockOnActiveFlowFor(ctx) {
        const flow = IContext_1.getActiveFlowFrom(ctx);
        const { cursor } = ctx;
        if (cursor == null) {
            return lodash_2.first(flow.blocks);
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
        return lodash_2.find(blocks, { uuid: destinationBlock });
    }
    createBlockInteractionFor({ uuid: blockId, type }, flowId, originFlowId, originBlockInteractionId) {
        return {
            uuid: this.idGenerator.generate(),
            blockId,
            flowId,
            entryAt: new Date().toISOString(),
            exitAt: undefined,
            hasResponse: false,
            value: undefined,
            details: { selectedExitId: null },
            type,
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
    buildPromptFor(block, interaction) {
        const runner = this.createBlockRunnerFor(block, this.context);
        const promptConfig = runner.initialize(interaction);
        return this.createPromptFrom(promptConfig, interaction);
    }
    createPromptFrom(config, interaction) {
        if (config == null || interaction == null) {
            return;
        }
        const kindConstructor = {
            [IPrompt_1.KnownPrompts.Message]: MessagePrompt_1.default,
            [IPrompt_1.KnownPrompts.Numeric]: NumericPrompt_1.default,
            [IPrompt_1.KnownPrompts.Open]: OpenPrompt_1.default,
            [IPrompt_1.KnownPrompts.SelectOne]: SelectOnePrompt_1.default,
            [IPrompt_1.KnownPrompts.SelectMany]: SelectManyPrompt_1.default,
        }[config.kind];
        return new kindConstructor(config, interaction.uuid, this);
    }
}
exports.default = FlowRunner;
//# sourceMappingURL=FlowRunner.js.map