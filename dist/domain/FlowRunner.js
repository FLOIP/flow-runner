"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sp2_1 = require("sp2");
const lodash_1 = require("lodash");
const IBlock_1 = require("../flow-spec/IBlock");
const contextService = tslib_1.__importStar(require("../flow-spec/IContext"));
const IdGeneratorUuidV4_1 = tslib_1.__importDefault(require("./IdGeneratorUuidV4"));
const ValidationException_1 = tslib_1.__importDefault(require("./exceptions/ValidationException"));
const IPrompt_1 = require("./prompt/IPrompt");
const MessagePrompt_1 = tslib_1.__importDefault(require("./prompt/MessagePrompt"));
const DeliveryStatus_1 = tslib_1.__importDefault(require("../flow-spec/DeliveryStatus"));
const NumericPrompt_1 = tslib_1.__importDefault(require("./prompt/NumericPrompt"));
const OpenPrompt_1 = tslib_1.__importDefault(require("./prompt/OpenPrompt"));
const SelectOnePrompt_1 = tslib_1.__importDefault(require("./prompt/SelectOnePrompt"));
const SelectManyPrompt_1 = tslib_1.__importDefault(require("./prompt/SelectManyPrompt"));
const BasicBacktrackingBehaviour_1 = tslib_1.__importDefault(require("./behaviours/BacktrackingBehaviour/BasicBacktrackingBehaviour"));
const MessageBlockRunner_1 = tslib_1.__importDefault(require("./runners/MessageBlockRunner"));
const OpenResponseBlockRunner_1 = tslib_1.__importDefault(require("./runners/OpenResponseBlockRunner"));
const NumericResponseBlockRunner_1 = tslib_1.__importDefault(require("./runners/NumericResponseBlockRunner"));
const SelectOneResponseBlockRunner_1 = tslib_1.__importDefault(require("./runners/SelectOneResponseBlockRunner"));
const SelectManyResponseBlockRunner_1 = tslib_1.__importDefault(require("./runners/SelectManyResponseBlockRunner"));
const CaseBlockRunner_1 = tslib_1.__importDefault(require("./runners/CaseBlockRunner"));
const ResourceResolver_1 = tslib_1.__importDefault(require("./ResourceResolver"));
const RunFlowBlockRunner_1 = tslib_1.__importDefault(require("./runners/RunFlowBlockRunner"));
const ReadBlockRunner_1 = tslib_1.__importDefault(require("./runners/ReadBlockRunner"));
const PrintBlockRunner_1 = tslib_1.__importDefault(require("./runners/PrintBlockRunner"));
const LogBlockRunner_1 = tslib_1.__importDefault(require("./runners/LogBlockRunner"));
const OutputBlockRunner_1 = tslib_1.__importDefault(require("./runners/OutputBlockRunner"));
const ReadPrompt_1 = tslib_1.__importDefault(require("./prompt/ReadPrompt"));
const DateFormat_1 = tslib_1.__importDefault(require("./DateFormat"));
class BlockRunnerFactoryStore extends Map {
}
exports.BlockRunnerFactoryStore = BlockRunnerFactoryStore;
const DEFAULT_BEHAVIOUR_TYPES = [
    BasicBacktrackingBehaviour_1.default,
];
exports.NON_INTERACTIVE_BLOCK_TYPES = [
    'Core\\Case',
    'Core\\RunFlow',
];
function createDefaultBlockRunnerStore() {
    return new BlockRunnerFactoryStore([
        ['MobilePrimitives\\Message', (block, ctx) => new MessageBlockRunner_1.default(block, ctx)],
        ['MobilePrimitives\\OpenResponse', (block, ctx) => new OpenResponseBlockRunner_1.default(block, ctx)],
        ['MobilePrimitives\\NumericResponse', (block, ctx) => new NumericResponseBlockRunner_1.default(block, ctx)],
        ['MobilePrimitives\\SelectOneResponse', (block, ctx) => new SelectOneResponseBlockRunner_1.default(block, ctx)],
        ['MobilePrimitives\\SelectManyResponse', (block, ctx) => new SelectManyResponseBlockRunner_1.default(block, ctx)],
        ['Core\\Case', (block, ctx) => new CaseBlockRunner_1.default(block, ctx)],
        ['Core\\Output', (block, ctx) => new OutputBlockRunner_1.default(block, ctx)],
        ['Core\\Log', (block, ctx) => new LogBlockRunner_1.default(block, ctx)],
        ['ConsoleIO\\Print', (block, ctx) => new PrintBlockRunner_1.default(block, ctx)],
        ['ConsoleIO\\Read', (block, ctx) => new ReadBlockRunner_1.default(block, ctx)],
        ['Core\\RunFlow', (block, ctx) => new RunFlowBlockRunner_1.default(block, ctx)]
    ]);
}
exports.createDefaultBlockRunnerStore = createDefaultBlockRunnerStore;
function createKindPromptMap() {
    return {
        [IPrompt_1.KnownPrompts.Message.toString()]: MessagePrompt_1.default,
        [IPrompt_1.KnownPrompts.Numeric.toString()]: NumericPrompt_1.default,
        [IPrompt_1.KnownPrompts.Open.toString()]: OpenPrompt_1.default,
        [IPrompt_1.KnownPrompts.Read.toString()]: ReadPrompt_1.default,
        [IPrompt_1.KnownPrompts.SelectOne.toString()]: SelectOnePrompt_1.default,
        [IPrompt_1.KnownPrompts.SelectMany.toString()]: SelectManyPrompt_1.default,
    };
}
exports.createKindPromptMap = createKindPromptMap;
class FlowRunner {
    constructor(context, runnerFactoryStore = createDefaultBlockRunnerStore(), idGenerator = new IdGeneratorUuidV4_1.default, behaviours = {}, _contextService = contextService) {
        this.context = context;
        this.runnerFactoryStore = runnerFactoryStore;
        this.idGenerator = idGenerator;
        this.behaviours = behaviours;
        this._contextService = _contextService;
        this.initializeBehaviours(DEFAULT_BEHAVIOUR_TYPES);
    }
    initializeBehaviours(behaviourConstructors) {
        behaviourConstructors.forEach(b => this.behaviours[lodash_1.lowerFirst(lodash_1.trimEnd(b.name, 'Behaviour|Behavior'))]
            = new b(this.context, this, this));
    }
    initialize() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = this.context;
            const block = this.findNextBlockOnActiveFlowFor(ctx);
            if (block == null) {
                throw new ValidationException_1.default('Unable to initialize flow without blocks.');
            }
            ctx.deliveryStatus = DeliveryStatus_1.default.IN_PROGRESS;
            ctx.entryAt = DateFormat_1.default();
            return this.navigateTo(block, this.context);
        });
    }
    isInitialized(ctx) {
        return ctx.cursor != null;
    }
    isFirst() {
        const { cursor, interactions } = this.context;
        if (!this.isInitialized(this.context)) {
            return true;
        }
        const firstInteractiveIntx = lodash_1.find(interactions, ({ type }) => !lodash_1.includes(exports.NON_INTERACTIVE_BLOCK_TYPES, type));
        if (firstInteractiveIntx == null) {
            return true;
        }
        return firstInteractiveIntx.uuid === cursor.interactionId;
    }
    isLast() {
        const { cursor, interactions } = this.context;
        if (!this.isInitialized(this.context)) {
            return true;
        }
        return lodash_1.last(interactions).uuid === cursor.interactionId;
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { context: ctx } = this;
            if (!this.isInitialized(ctx)) {
                this.initialize();
            }
            return this.runUntilInputRequiredFrom(ctx);
        });
    }
    isInputRequiredFor(ctx) {
        if (ctx.cursor == null || ctx.cursor.promptConfig == null) {
            return false;
        }
        if (ctx.cursor.promptConfig.value === undefined) {
            return true;
        }
        const { prompt } = this.hydrateRichCursorFrom(ctx);
        try {
            prompt.validate(prompt.value);
            return false;
        }
        catch (e) {
            return true;
        }
    }
    cacheInteractionByBlockName({ uuid, entryAt }, { name, config: { prompt } }, context = this.context) {
        if (!('blockInteractionsByBlockName' in this.context.sessionVars)) {
            context.sessionVars.blockInteractionsByBlockName = {};
        }
        if (context.reversibleOperations == null) {
            context.reversibleOperations = [];
        }
        const blockNameKey = `blockInteractionsByBlockName.${name}`;
        const previous = this.context.sessionVars[blockNameKey];
        const resource = prompt == null
            ? undefined
            : new ResourceResolver_1.default(context).resolve(prompt);
        const current = {
            __interactionId: uuid,
            time: entryAt,
            text: resource != null && resource.hasText()
                ? resource.getText()
                : '',
        };
        this.applyReversibleDataOperation({ $set: { [blockNameKey]: current } }, { $set: { [blockNameKey]: previous } });
    }
    applyReversibleDataOperation(forward, reverse, context = this.context) {
        var _a;
        context.sessionVars = sp2_1.update(context.sessionVars, forward);
        context.reversibleOperations.push({
            interactionId: (_a = lodash_1.last(context.interactions)) === null || _a === void 0 ? void 0 : _a.uuid,
            forward,
            reverse,
        });
    }
    reverseLastDataOperation(context = this.context) {
        if (context.reversibleOperations.length === 0) {
            return;
        }
        const lastOperation = lodash_1.last(context.reversibleOperations);
        context.sessionVars = sp2_1.update(context.sessionVars, lastOperation.reverse);
        return context.reversibleOperations.pop();
    }
    runUntilInputRequiredFrom(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let richCursor = this.hydrateRichCursorFrom(ctx);
            let block = this._contextService.findBlockOnActiveFlowWith(richCursor.interaction.blockId, ctx);
            do {
                if (this.isInputRequiredFor(ctx)) {
                    console.info('Attempted to resume when prompt is not yet fulfilled; resurfacing same prompt instance.');
                    return Promise.resolve(richCursor);
                }
                yield this.runActiveBlockOn(richCursor, block);
                block = this.findNextBlockOnActiveFlowFor(ctx);
                if (block == null) {
                    block = this.stepOut(ctx);
                }
                if (block == null) {
                    continue;
                }
                if (block.type === 'Core\\RunFlow') {
                    richCursor = this.navigateTo(block, ctx);
                    block = this.stepInto(block, ctx);
                }
                if (block == null) {
                    continue;
                }
                richCursor = this.navigateTo(block, ctx);
            } while (block != null);
            this.complete(ctx);
            return Promise.resolve(undefined);
        });
    }
    complete(ctx) {
        lodash_1.last(ctx.interactions).exitAt = DateFormat_1.default();
        delete ctx.cursor;
        ctx.deliveryStatus = DeliveryStatus_1.default.FINISHED_COMPLETE;
        ctx.exitAt = DateFormat_1.default();
    }
    dehydrateCursor(richCursor) {
        return {
            interactionId: richCursor.interaction.uuid,
            promptConfig: richCursor.prompt != null ? richCursor.prompt.config : undefined
        };
    }
    hydrateRichCursorFrom(ctx) {
        const { cursor } = ctx;
        const interaction = this._contextService.findInteractionWith(cursor.interactionId, ctx);
        const prompt = this.createPromptFrom(cursor.promptConfig, interaction);
        return { interaction, prompt };
    }
    initializeOneBlock(block, flowId, originFlowId, originBlockInteractionId) {
        let interaction = this.createBlockInteractionFor(block, flowId, originFlowId, originBlockInteractionId);
        Object.values(this.behaviours)
            .forEach(b => interaction = b.postInteractionCreate(interaction, this.context));
        return { interaction, prompt: this.buildPromptFor(block, interaction) };
    }
    runActiveBlockOn(richCursor, block) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (richCursor.prompt != null) {
                richCursor.interaction.value = richCursor.prompt.value;
                richCursor.interaction.hasResponse = true;
            }
            const exit = yield this.createBlockRunnerFor(block, this.context)
                .run(richCursor);
            richCursor.interaction.selectedExitId = exit.uuid;
            if (richCursor.prompt != null) {
                richCursor.prompt.config.isSubmitted = true;
            }
            Object.values(this.behaviours)
                .forEach(b => b.postInteractionComplete(richCursor.interaction, this.context));
            return exit;
        });
    }
    createBlockRunnerFor(block, ctx) {
        const factory = this.runnerFactoryStore.get(block.type);
        if (factory == null) {
            throw new ValidationException_1.default(`Unable to find factory for block type: ${block.type}`);
        }
        return factory(block, ctx);
    }
    navigateTo(block, ctx, navigatedAt = new Date) {
        const { interactions, nestedFlowBlockInteractionIdStack } = ctx;
        const flowId = this._contextService.getActiveFlowIdFrom(ctx);
        const originInteractionId = lodash_1.last(nestedFlowBlockInteractionIdStack);
        const originInteraction = originInteractionId != null
            ? this._contextService.findInteractionWith(originInteractionId, ctx)
            : null;
        const richCursor = this.initializeOneBlock(block, flowId, originInteraction == null ? undefined : originInteraction.flowId, originInteractionId);
        this.cacheInteractionByBlockName(richCursor.interaction, block, this.context);
        const lastInteraction = lodash_1.last(interactions);
        if (lastInteraction != null) {
            lastInteraction.exitAt = DateFormat_1.default(navigatedAt);
        }
        interactions.push(richCursor.interaction);
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
        const firstNestedBlock = lodash_1.first(this._contextService.getActiveFlowFrom(ctx).blocks);
        if (firstNestedBlock == null) {
            return undefined;
        }
        return firstNestedBlock;
    }
    stepOut(ctx) {
        const { nestedFlowBlockInteractionIdStack } = ctx;
        const { _contextService: contextService } = this;
        if (nestedFlowBlockInteractionIdStack.length === 0) {
            return;
        }
        const lastRunFlowIntxId = nestedFlowBlockInteractionIdStack.pop();
        const lastRunFlowIntx = contextService.findInteractionWith(lastRunFlowIntxId, ctx);
        const lastRunFlowBlock = contextService.findBlockOnActiveFlowWith(lastRunFlowIntx.blockId, ctx);
        const { uuid: lastRunFlowBlockFirstExitId, destinationBlock: destinationBlockId } = lodash_1.first(lastRunFlowBlock.exits);
        lastRunFlowIntx.selectedExitId = lastRunFlowBlockFirstExitId;
        if (destinationBlockId == null) {
            return;
        }
        return contextService.findBlockOnActiveFlowWith(destinationBlockId, ctx);
    }
    findInteractionForActiveNestedFlow({ nestedFlowBlockInteractionIdStack, interactions }) {
        if (nestedFlowBlockInteractionIdStack.length === 0) {
            throw new ValidationException_1.default('Unable to find interaction for nested flow when not nested');
        }
        const intx = lodash_1.findLast(interactions, { uuid: lodash_1.last(nestedFlowBlockInteractionIdStack) });
        if (intx == null) {
            throw new ValidationException_1.default('Unable to find interaction for deepest flow nesting');
        }
        return intx;
    }
    findNextBlockOnActiveFlowFor(ctx) {
        const flow = this._contextService.getActiveFlowFrom(ctx);
        const { cursor } = ctx;
        if (cursor == null) {
            return lodash_1.first(flow.blocks);
        }
        const interaction = this._contextService.findInteractionWith(cursor.interactionId, ctx);
        return this.findNextBlockFrom(interaction, ctx);
    }
    findNextBlockFrom({ blockId, selectedExitId }, ctx) {
        if (selectedExitId == null) {
            throw new ValidationException_1.default('Unable to navigate past incomplete interaction; did you forget to call runner.run()?');
        }
        const block = this._contextService.findBlockOnActiveFlowWith(blockId, ctx);
        const { destinationBlock } = IBlock_1.findBlockExitWith(selectedExitId, block);
        const { blocks } = this._contextService.getActiveFlowFrom(ctx);
        return lodash_1.find(blocks, { uuid: destinationBlock });
    }
    createBlockInteractionFor({ uuid: blockId, type }, flowId, originFlowId, originBlockInteractionId) {
        return {
            uuid: this.idGenerator.generate(),
            blockId,
            flowId,
            entryAt: DateFormat_1.default(),
            exitAt: undefined,
            hasResponse: false,
            value: undefined,
            selectedExitId: null,
            details: {},
            type,
            originFlowId,
            originBlockInteractionId,
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
        const promptConstructor = createKindPromptMap()[config.kind];
        return new promptConstructor(config, interaction.uuid, this);
    }
}
exports.FlowRunner = FlowRunner;
exports.default = FlowRunner;
//# sourceMappingURL=FlowRunner.js.map