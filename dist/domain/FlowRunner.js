"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var IBlock_1 = require("../flow-spec/IBlock");
var IContext_1 = require("../flow-spec/IContext");
var lodash_2 = require("lodash");
var IdGeneratorUuidV4_1 = tslib_1.__importDefault(require("./IdGeneratorUuidV4"));
var ValidationException_1 = tslib_1.__importDefault(require("./exceptions/ValidationException"));
var IPrompt_1 = require("./prompt/IPrompt");
var MessagePrompt_1 = tslib_1.__importDefault(require("./prompt/MessagePrompt"));
var DeliveryStatus_1 = tslib_1.__importDefault(require("../flow-spec/DeliveryStatus"));
var NumericPrompt_1 = tslib_1.__importDefault(require("./prompt/NumericPrompt"));
var OpenPrompt_1 = tslib_1.__importDefault(require("./prompt/OpenPrompt"));
var SelectOnePrompt_1 = tslib_1.__importDefault(require("./prompt/SelectOnePrompt"));
var SelectManyPrompt_1 = tslib_1.__importDefault(require("./prompt/SelectManyPrompt"));
var BasicBacktrackingBehaviour_1 = tslib_1.__importDefault(require("./behaviours/BacktrackingBehaviour/BasicBacktrackingBehaviour"));
var MessageBlockRunner_1 = tslib_1.__importDefault(require("./runners/MessageBlockRunner"));
var OpenResponseBlockRunner_1 = tslib_1.__importDefault(require("./runners/OpenResponseBlockRunner"));
var NumericResponseBlockRunner_1 = tslib_1.__importDefault(require("./runners/NumericResponseBlockRunner"));
var SelectOneResponseBlockRunner_1 = tslib_1.__importDefault(require("./runners/SelectOneResponseBlockRunner"));
var SelectManyResponseBlockRunner_1 = tslib_1.__importDefault(require("./runners/SelectManyResponseBlockRunner"));
var CaseBlockRunner_1 = tslib_1.__importDefault(require("./runners/CaseBlockRunner"));
var BlockRunnerFactoryStore = (function (_super) {
    tslib_1.__extends(BlockRunnerFactoryStore, _super);
    function BlockRunnerFactoryStore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BlockRunnerFactoryStore;
}(Map));
exports.BlockRunnerFactoryStore = BlockRunnerFactoryStore;
var DEFAULT_BEHAVIOUR_TYPES = [
    BasicBacktrackingBehaviour_1.default,
];
exports.NON_INTERACTIVE_BLOCK_TYPES = [
    'Core\\Case',
    'Core\\RunFlowBlock',
];
function createDefaultBlockRunnerStore() {
    return new BlockRunnerFactoryStore([
        ['MobilePrimitives\\Message', function (block, innerContext) { return new MessageBlockRunner_1.default(block, innerContext); }],
        ['MobilePrimitives\\OpenResponse', function (block, innerContext) { return new OpenResponseBlockRunner_1.default(block, innerContext); }],
        ['MobilePrimitives\\NumericResponse', function (block, innerContext) { return new NumericResponseBlockRunner_1.default(block, innerContext); }],
        ['MobilePrimitives\\SelectOneResponse', function (block, innerContext) { return new SelectOneResponseBlockRunner_1.default(block, innerContext); }],
        ['MobilePrimitives\\SelectManyResponse', function (block, innerContext) { return new SelectManyResponseBlockRunner_1.default(block, innerContext); }],
        ['Core\\Case', function (block, innerContext) { return new CaseBlockRunner_1.default(block, innerContext); }]
    ]);
}
exports.createDefaultBlockRunnerStore = createDefaultBlockRunnerStore;
var FlowRunner = (function () {
    function FlowRunner(context, runnerFactoryStore, idGenerator, behaviours) {
        if (runnerFactoryStore === void 0) { runnerFactoryStore = createDefaultBlockRunnerStore(); }
        if (idGenerator === void 0) { idGenerator = new IdGeneratorUuidV4_1.default; }
        if (behaviours === void 0) { behaviours = {}; }
        this.context = context;
        this.runnerFactoryStore = runnerFactoryStore;
        this.idGenerator = idGenerator;
        this.behaviours = behaviours;
        this.initializeBehaviours(DEFAULT_BEHAVIOUR_TYPES);
    }
    FlowRunner.prototype.initializeBehaviours = function (behaviourConstructors) {
        var _this = this;
        behaviourConstructors.forEach(function (b) {
            return _this.behaviours[lodash_1.lowerFirst(lodash_1.trimEnd(b.name, 'Behaviour|Behavior'))]
                = new b(_this.context, _this, _this);
        });
    };
    FlowRunner.prototype.initialize = function () {
        var ctx = this.context;
        var block = this.findNextBlockOnActiveFlowFor(ctx);
        if (block == null) {
            throw new ValidationException_1.default('Unable to initialize flow without blocks.');
        }
        ctx.deliveryStatus = DeliveryStatus_1.default.IN_PROGRESS;
        ctx.entryAt = (new Date).toISOString().replace('T', ' ');
        return this.navigateTo(block, this.context);
    };
    FlowRunner.prototype.isInitialized = function (ctx) {
        return ctx.cursor != null;
    };
    FlowRunner.prototype.isFirst = function () {
        var _a = this.context, cursor = _a.cursor, interactions = _a.interactions;
        if (!this.isInitialized(this.context)) {
            return true;
        }
        var firstInteractiveIntx = lodash_2.find(interactions, function (_a) {
            var type = _a.type;
            return !lodash_2.includes(exports.NON_INTERACTIVE_BLOCK_TYPES, type);
        });
        if (firstInteractiveIntx == null) {
            return true;
        }
        return firstInteractiveIntx.uuid === cursor[0];
    };
    FlowRunner.prototype.isLast = function () {
        var _a = this.context, cursor = _a.cursor, interactions = _a.interactions;
        if (!this.isInitialized(this.context)) {
            return true;
        }
        return lodash_2.last(interactions).uuid === cursor[0];
    };
    FlowRunner.prototype.run = function () {
        var ctx = this.context;
        if (!this.isInitialized(ctx)) {
            this.initialize();
        }
        return this.runUntilInputRequiredFrom(ctx);
    };
    FlowRunner.prototype.isInputRequiredFor = function (ctx) {
        return ctx.cursor != null
            && ctx.cursor[1] != null
            && ctx.cursor[1].value === undefined;
    };
    FlowRunner.prototype.runUntilInputRequiredFrom = function (ctx) {
        var richCursor = this.hydrateRichCursorFrom(ctx);
        var block = IContext_1.findBlockOnActiveFlowWith(richCursor[0].blockId, ctx);
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
    };
    FlowRunner.prototype.complete = function (ctx) {
        lodash_2.last(ctx.interactions).exitAt = (new Date).toISOString().replace('T', ' ');
        delete ctx.cursor;
        ctx.deliveryStatus = DeliveryStatus_1.default.FINISHED_COMPLETE;
        ctx.exitAt = (new Date).toISOString().replace('T', ' ');
    };
    FlowRunner.prototype.dehydrateCursor = function (richCursor) {
        return [richCursor[0].uuid, richCursor[1] != null ? richCursor[1].config : undefined];
    };
    FlowRunner.prototype.hydrateRichCursorFrom = function (ctx) {
        var cursor = ctx.cursor;
        var interaction = IContext_1.findInteractionWith(cursor[0], ctx);
        return [interaction, this.createPromptFrom(cursor[1], interaction)];
    };
    FlowRunner.prototype.initializeOneBlock = function (block, flowId, originFlowId, originBlockInteractionId) {
        var _this = this;
        var interaction = this.createBlockInteractionFor(block, flowId, originFlowId, originBlockInteractionId);
        Object.values(this.behaviours)
            .forEach(function (b) { return interaction = b.postInteractionCreate(interaction, _this.context); });
        return [interaction, this.buildPromptFor(block, interaction)];
    };
    FlowRunner.prototype.runActiveBlockOn = function (richCursor, block) {
        var _this = this;
        if (richCursor[1] != null) {
            richCursor[0].value = richCursor[1].value;
            richCursor[0].hasResponse = true;
        }
        var exit = this.createBlockRunnerFor(block, this.context)
            .run(richCursor);
        richCursor[0].selectedExitId = exit.uuid;
        if (richCursor[1] != null) {
            richCursor[1].config.isSubmitted = true;
        }
        Object.values(this.behaviours)
            .forEach(function (b) { return b.postInteractionComplete(richCursor[0], _this.context); });
        return exit;
    };
    FlowRunner.prototype.createBlockRunnerFor = function (block, ctx) {
        var factory = this.runnerFactoryStore.get(block.type);
        if (factory == null) {
            throw new ValidationException_1.default("Unable to find factory for block type: " + block.type);
        }
        return factory(block, ctx);
    };
    FlowRunner.prototype.navigateTo = function (block, ctx, navigatedAt) {
        if (navigatedAt === void 0) { navigatedAt = new Date; }
        var interactions = ctx.interactions, nestedFlowBlockInteractionIdStack = ctx.nestedFlowBlockInteractionIdStack;
        var flowId = IContext_1.getActiveFlowIdFrom(ctx);
        var originInteractionId = lodash_2.last(nestedFlowBlockInteractionIdStack);
        var originInteraction = originInteractionId != null
            ? IContext_1.findInteractionWith(originInteractionId, ctx)
            : null;
        var richCursor = this.initializeOneBlock(block, flowId, originInteraction == null ? undefined : originInteraction.flowId, originInteractionId);
        var lastInteraction = lodash_2.last(interactions);
        if (lastInteraction != null) {
            lastInteraction.exitAt = navigatedAt.toISOString().replace('T', ' ');
        }
        interactions.push(richCursor[0]);
        ctx.cursor = this.dehydrateCursor(richCursor);
        return richCursor;
    };
    FlowRunner.prototype.stepInto = function (runFlowBlock, ctx) {
        if (runFlowBlock.type !== 'Core\\RunFlow') {
            throw new ValidationException_1.default('Unable to step into a non-Core\\RunFlow block type');
        }
        var runFlowInteraction = lodash_2.last(ctx.interactions);
        if (runFlowInteraction == null) {
            throw new ValidationException_1.default('Unable to step into Core\\RunFlow that hasn\'t yet been started');
        }
        if (runFlowBlock.uuid !== runFlowInteraction.blockId) {
            throw new ValidationException_1.default('Unable to step into Core\\RunFlow block that doesn\'t match last interaction');
        }
        ctx.nestedFlowBlockInteractionIdStack.push(runFlowInteraction.uuid);
        var firstNestedBlock = lodash_2.first(IContext_1.getActiveFlowFrom(ctx).blocks);
        if (firstNestedBlock == null) {
            return undefined;
        }
        runFlowInteraction.selectedExitId = runFlowBlock.exits[0].uuid;
        return firstNestedBlock;
    };
    FlowRunner.prototype.stepOut = function (ctx) {
        var nestedFlowBlockInteractionIdStack = ctx.nestedFlowBlockInteractionIdStack;
        if (nestedFlowBlockInteractionIdStack.length === 0) {
            return;
        }
        var lastParentInteractionId = nestedFlowBlockInteractionIdStack.pop();
        var lastRunFlowBlockId = IContext_1.findInteractionWith(lastParentInteractionId, ctx).blockId;
        var lastRunFlowBlock = IContext_1.findBlockOnActiveFlowWith(lastRunFlowBlockId, ctx);
        var destinationBlock = lodash_2.first(lastRunFlowBlock.exits).destinationBlock;
        if (destinationBlock == null) {
            return;
        }
        return IContext_1.findBlockOnActiveFlowWith(destinationBlock, ctx);
    };
    FlowRunner.prototype.findNextBlockOnActiveFlowFor = function (ctx) {
        var flow = IContext_1.getActiveFlowFrom(ctx);
        var cursor = ctx.cursor;
        if (cursor == null) {
            return lodash_2.first(flow.blocks);
        }
        var interaction = IContext_1.findInteractionWith(cursor[0], ctx);
        return this.findNextBlockFrom(interaction, ctx);
    };
    FlowRunner.prototype.findNextBlockFrom = function (interaction, ctx) {
        if (interaction.selectedExitId == null) {
            throw new ValidationException_1.default('Unable to navigate past incomplete interaction; did you forget to call runner.run()?');
        }
        var block = IContext_1.findBlockOnActiveFlowWith(interaction.blockId, ctx);
        var destinationBlock = IBlock_1.findBlockExitWith(interaction.selectedExitId, block).destinationBlock;
        var blocks = IContext_1.getActiveFlowFrom(ctx).blocks;
        return lodash_2.find(blocks, { uuid: destinationBlock });
    };
    FlowRunner.prototype.createBlockInteractionFor = function (_a, flowId, originFlowId, originBlockInteractionId) {
        var blockId = _a.uuid, type = _a.type;
        return {
            uuid: this.idGenerator.generate(),
            blockId: blockId,
            flowId: flowId,
            entryAt: (new Date).toISOString().replace('T', ' '),
            exitAt: undefined,
            hasResponse: false,
            value: undefined,
            selectedExitId: null,
            details: {},
            type: type,
            originFlowId: originFlowId,
            originBlockInteractionId: originBlockInteractionId,
        };
    };
    FlowRunner.prototype.buildPromptFor = function (block, interaction) {
        var runner = this.createBlockRunnerFor(block, this.context);
        var promptConfig = runner.initialize(interaction);
        return this.createPromptFrom(promptConfig, interaction);
    };
    FlowRunner.prototype.createPromptFrom = function (config, interaction) {
        var _a;
        if (config == null || interaction == null) {
            return;
        }
        var kindConstructor = (_a = {},
            _a[IPrompt_1.KnownPrompts.Message] = MessagePrompt_1.default,
            _a[IPrompt_1.KnownPrompts.Numeric] = NumericPrompt_1.default,
            _a[IPrompt_1.KnownPrompts.Open] = OpenPrompt_1.default,
            _a[IPrompt_1.KnownPrompts.SelectOne] = SelectOnePrompt_1.default,
            _a[IPrompt_1.KnownPrompts.SelectMany] = SelectManyPrompt_1.default,
            _a)[config.kind];
        return new kindConstructor(config, interaction.uuid, this);
    };
    return FlowRunner;
}());
exports.default = FlowRunner;
//# sourceMappingURL=FlowRunner.js.map