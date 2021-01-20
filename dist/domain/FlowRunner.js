"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowRunner = exports.createDefaultBlockRunnerStore = exports.NON_INTERACTIVE_BLOCK_TYPES = exports.BlockRunnerFactoryStore = void 0;
const tslib_1 = require("tslib");
const sp2_1 = require("sp2");
const lodash_1 = require("lodash");
const __1 = require("..");
class BlockRunnerFactoryStore extends Map {
}
exports.BlockRunnerFactoryStore = BlockRunnerFactoryStore;
const DEFAULT_BEHAVIOUR_TYPES = [
    __1.BasicBacktrackingBehaviour,
];
exports.NON_INTERACTIVE_BLOCK_TYPES = ['Core\\Case', 'Core\\RunFlow'];
function createDefaultBlockRunnerStore() {
    return new BlockRunnerFactoryStore([
        ['MobilePrimitives\\Message', (block, ctx) => new __1.MessageBlockRunner(block, ctx)],
        ['MobilePrimitives\\OpenResponse', (block, ctx) => new __1.OpenResponseBlockRunner(block, ctx)],
        ['MobilePrimitives\\NumericResponse', (block, ctx) => new __1.NumericResponseBlockRunner(block, ctx)],
        ['MobilePrimitives\\SelectOneResponse', (block, ctx) => new __1.SelectOneResponseBlockRunner(block, ctx)],
        ['MobilePrimitives\\SelectManyResponse', (block, ctx) => new __1.SelectManyResponseBlockRunner(block, ctx)],
        ['Core\\Case', (block, ctx) => new __1.CaseBlockRunner(block, ctx)],
        ['Core\\Output', (block, ctx) => new __1.OutputBlockRunner(block, ctx)],
        ['Core\\Log', (block, ctx) => new __1.LogBlockRunner(block, ctx)],
        ['ConsoleIO\\Print', (block, ctx) => new __1.PrintBlockRunner(block, ctx)],
        ['Core\\RunFlow', (block, ctx) => new __1.RunFlowBlockRunner(block, ctx)],
        [__1.SET_GROUP_MEMBERSHIP_BLOCK_TYPE, (block, ctx) => new __1.SetGroupMembershipBlockRunner(block, ctx)],
    ]);
}
exports.createDefaultBlockRunnerStore = createDefaultBlockRunnerStore;
class FlowRunner {
    constructor(context, runnerFactoryStore = createDefaultBlockRunnerStore(), idGenerator = new __1.IdGeneratorUuidV4(), behaviours = {}, _contextService = __1.ContextService) {
        this.runnerFactoryStore = createDefaultBlockRunnerStore();
        this.idGenerator = new __1.IdGeneratorUuidV4();
        this.behaviours = {};
        this._contextService = __1.ContextService;
        this._contextService = _contextService;
        this.behaviours = behaviours;
        this.idGenerator = idGenerator;
        this.runnerFactoryStore = runnerFactoryStore;
        this.context = context;
        this.initializeBehaviours(DEFAULT_BEHAVIOUR_TYPES);
    }
    initializeBehaviours(behaviourConstructors) {
        behaviourConstructors.forEach(behaviourConstructor => (this.behaviours[lodash_1.lowerFirst(lodash_1.trimEnd(behaviourConstructor.name, 'Behaviour|Behavior'))] = new behaviourConstructor(this.context, this, this)));
    }
    initialize() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = this.context;
            const block = this.findNextBlockOnActiveFlowFor(ctx);
            if (block == null) {
                throw new __1.ValidationException('Unable to initialize flow without blocks.');
            }
            ctx.deliveryStatus = __1.DeliveryStatus.IN_PROGRESS;
            ctx.entryAt = __1.createFormattedDate();
            return this.navigateTo(block, this.context);
        });
    }
    isInitialized(ctx) {
        return ctx.cursor != null;
    }
    isFirst() {
        if (!this.isInitialized(this.context)) {
            return true;
        }
        const { interactions } = this.context;
        const firstInteractiveIntx = lodash_1.find(interactions, ({ type }) => !lodash_1.includes(exports.NON_INTERACTIVE_BLOCK_TYPES, type));
        if (firstInteractiveIntx == null) {
            return true;
        }
        return firstInteractiveIntx.uuid === this.context.cursor.interactionId;
    }
    isLast() {
        var _a;
        if (!this.isInitialized(this.context)) {
            return true;
        }
        const { interactions } = this.context;
        return ((_a = lodash_1.last(interactions)) === null || _a === void 0 ? void 0 : _a.uuid) === this.context.cursor.interactionId;
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { context: ctx } = this;
            if (!this.isInitialized(ctx)) {
                yield this.initialize();
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
        return !prompt.isValid();
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
        const resource = prompt == null ? undefined : new __1.ResourceResolver(context).resolve(prompt);
        const current = {
            __interactionId: uuid,
            time: entryAt,
            text: resource != null && resource.hasText() ? resource.getText() : '',
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
                    return richCursor;
                }
                yield this.runActiveBlockOn(richCursor, block);
                block = this.findNextBlockOnActiveFlowFor(ctx);
                while (block == null && this._contextService.isNested(ctx)) {
                    block = this.stepOut(ctx);
                }
                if (block == null) {
                    continue;
                }
                if (block.type === 'Core\\RunFlow') {
                    richCursor = yield this.navigateTo(block, ctx);
                    block = this.stepInto(block, ctx);
                }
                if (block == null) {
                    continue;
                }
                richCursor = yield this.navigateTo(block, ctx);
            } while (block != null);
            this.complete(ctx);
            return;
        });
    }
    complete(ctx, completedAt = new Date()) {
        delete ctx.cursor;
        ctx.deliveryStatus = __1.DeliveryStatus.FINISHED_COMPLETE;
        ctx.exitAt = __1.createFormattedDate(completedAt);
    }
    completeInteraction(intx, selectedExitId, completedAt = new Date()) {
        intx.exitAt = __1.createFormattedDate(completedAt);
        intx.selectedExitId = selectedExitId;
        return intx;
    }
    completeActiveNestedFlow(ctx, completedAt = new Date()) {
        const { nestedFlowBlockInteractionIdStack } = ctx;
        if (!this._contextService.isNested(ctx)) {
            throw new __1.ValidationException('Unable to complete a nested flow when not nested.');
        }
        const runFlowIntx = this._contextService.findInteractionWith(lodash_1.last(nestedFlowBlockInteractionIdStack), ctx);
        nestedFlowBlockInteractionIdStack.pop();
        const exit = this.findFirstExitOnActiveFlowBlockFor(runFlowIntx, ctx);
        return this.completeInteraction(runFlowIntx, exit.uuid, completedAt);
    }
    dehydrateCursor(richCursor) {
        return {
            interactionId: richCursor.interaction.uuid,
            promptConfig: richCursor.prompt != null ? richCursor.prompt.config : undefined,
        };
    }
    hydrateRichCursorFrom(ctx) {
        const { cursor } = ctx;
        const interaction = this._contextService.findInteractionWith(cursor.interactionId, ctx);
        const prompt = this.createPromptFrom(cursor.promptConfig, interaction);
        return { interaction, prompt };
    }
    initializeOneBlock(block, flowId, originFlowId, originBlockInteractionId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let interaction = this.createBlockInteractionFor(block, flowId, originFlowId, originBlockInteractionId);
            Object.values(this.behaviours).forEach(b => (interaction = b.postInteractionCreate(interaction, this.context)));
            return { interaction, prompt: undefined };
        });
    }
    isRichCursorInputRequired(richCursor) {
        return richCursor.prompt != null;
    }
    runActiveBlockOn(richCursor, block) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { interaction } = richCursor;
            __1.assertNotNull(interaction, () => 'Unable to run with absent cursor interaction', errorMessage => new __1.ValidationException(errorMessage));
            if (this.isRichCursorInputRequired(richCursor) && richCursor.prompt.config.isSubmitted) {
                throw new __1.ValidationException('Unable to run against previously processed prompt');
            }
            if (this.isRichCursorInputRequired(richCursor)) {
                interaction.value = richCursor.prompt.value;
                interaction.hasResponse = interaction.value != null;
            }
            const exit = yield this.createBlockRunnerFor(block, this.context).run(richCursor);
            this.completeInteraction(interaction, exit.uuid);
            if (this.isRichCursorInputRequired(richCursor)) {
                richCursor.prompt.config.isSubmitted = true;
            }
            Object.values(this.behaviours).forEach(b => b.postInteractionComplete(richCursor.interaction, this.context));
            return exit;
        });
    }
    createBlockRunnerFor(block, ctx) {
        const factory = this.runnerFactoryStore.get(block.type);
        if (factory == null) {
            throw new __1.ValidationException(`Unable to find factory for block type: ${block.type}`);
        }
        return factory(block, ctx);
    }
    navigateTo(block, ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const richCursor = yield this._inflateInteractionAndContainerCursorFor(block, ctx);
            this._activateCursorOnto(ctx, richCursor);
            yield this._inflatePromptForBlockOnto(richCursor, block, ctx);
            this.cacheInteractionByBlockName(richCursor.interaction, block, ctx);
            return richCursor;
        });
    }
    _activateCursorOnto(ctx, richCursor) {
        ctx.cursor = this.dehydrateCursor(richCursor);
    }
    _inflateInteractionAndContainerCursorFor(block, ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { nestedFlowBlockInteractionIdStack } = ctx;
            const flowId = this._contextService.getActiveFlowIdFrom(ctx);
            const originInteractionId = lodash_1.last(nestedFlowBlockInteractionIdStack);
            const originInteraction = originInteractionId != null ? this._contextService.findInteractionWith(originInteractionId, ctx) : null;
            const richCursor = yield this.initializeOneBlock(block, flowId, originInteraction == null ? undefined : originInteraction.flowId, originInteractionId);
            const { interactions } = ctx;
            interactions.push(richCursor.interaction);
            return richCursor;
        });
    }
    stepInto(runFlowBlock, ctx) {
        if (runFlowBlock.type !== 'Core\\RunFlow') {
            throw new __1.ValidationException('Unable to step into a non-Core\\RunFlow block type');
        }
        const runFlowInteraction = lodash_1.last(ctx.interactions);
        if (runFlowInteraction == null) {
            throw new __1.ValidationException("Unable to step into Core\\RunFlow that hasn't yet been started");
        }
        if (runFlowBlock.uuid !== runFlowInteraction.blockId) {
            throw new __1.ValidationException("Unable to step into Core\\RunFlow block that doesn't match last interaction");
        }
        ctx.nestedFlowBlockInteractionIdStack.push(runFlowInteraction.uuid);
        const firstNestedBlock = lodash_1.first(this._contextService.getActiveFlowFrom(ctx).blocks);
        if (firstNestedBlock == null) {
            return;
        }
        return firstNestedBlock;
    }
    stepOut(ctx) {
        return this.findNextBlockFrom(this.completeActiveNestedFlow(ctx), ctx);
    }
    findFirstExitOnActiveFlowBlockFor({ blockId }, ctx) {
        const { exits } = this._contextService.findBlockOnActiveFlowWith(blockId, ctx);
        return lodash_1.first(exits);
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
            throw new __1.ValidationException('Unable to navigate past incomplete interaction; did you forget to call runner.run()?');
        }
        const block = this._contextService.findBlockOnActiveFlowWith(blockId, ctx);
        const { destinationBlock } = __1.findBlockExitWith(selectedExitId, block);
        const { blocks } = this._contextService.getActiveFlowFrom(ctx);
        return lodash_1.find(blocks, { uuid: destinationBlock });
    }
    createBlockInteractionFor({ uuid: blockId, type }, flowId, originFlowId, originBlockInteractionId) {
        return {
            uuid: this.idGenerator.generate(),
            blockId,
            flowId,
            entryAt: __1.createFormattedDate(),
            exitAt: undefined,
            hasResponse: false,
            value: undefined,
            selectedExitId: undefined,
            details: {},
            type,
            originFlowId,
            originBlockInteractionId,
        };
    }
    _inflatePromptForBlockOnto(richCursor, block, ctx) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            richCursor.prompt = yield this.buildPromptFor(block, richCursor.interaction);
            ctx.cursor.promptConfig = (_a = richCursor.prompt) === null || _a === void 0 ? void 0 : _a.config;
        });
    }
    buildPromptFor(block, interaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const runner = this.createBlockRunnerFor(block, this.context);
            const promptConfig = yield runner.initialize(interaction);
            return this.createPromptFrom(promptConfig, interaction);
        });
    }
    createPromptFrom(config, interaction) {
        var _a;
        if (config == null || interaction == null) {
            return;
        }
        const promptConstructor = (_a = __1.Prompt.valueOf(config.kind)) === null || _a === void 0 ? void 0 : _a.promptConstructor;
        if (promptConstructor != null) {
            return new promptConstructor(config, interaction.uuid, this);
        }
        else {
            return;
        }
    }
}
exports.FlowRunner = FlowRunner;
(function (FlowRunner) {
    class Builder {
        constructor() {
            this.runnerFactoryStore = createDefaultBlockRunnerStore();
            this.idGenerator = new __1.IdGeneratorUuidV4();
            this.behaviours = {};
            this._contextService = __1.ContextService;
        }
        setContext(context) {
            this.context = context;
            return this;
        }
        addBlockRunner(add) {
            add(this.runnerFactoryStore);
            return this;
        }
        setIdGenerator(idGenerator) {
            this.idGenerator = idGenerator;
            return this;
        }
        addBehaviour(behaviourKey, behaviour) {
            this.behaviours[behaviourKey] = behaviour;
            return this;
        }
        addCustomPrompt(constructor, promptKey) {
            __1.Prompt.addCustomPrompt(constructor, promptKey);
            return this;
        }
        build() {
            __1.assertNotNull(this.context, () => 'FlowRunner.Builder.setContext() must be called before FlowRunner.Builder.build()');
            return new FlowRunner(this.context, this.runnerFactoryStore, this.idGenerator, this.behaviours, this._contextService);
        }
    }
    FlowRunner.Builder = Builder;
})(FlowRunner = exports.FlowRunner || (exports.FlowRunner = {}));
//# sourceMappingURL=FlowRunner.js.map