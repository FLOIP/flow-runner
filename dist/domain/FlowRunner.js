"use strict";
/* eslint-disable @typescript-eslint/no-namespace,import/export */
/**
 * Flow Interoperability Project (flowinterop.org)
 * Flow Runner
 * Copyright (c) 2019, 2020 Viamo Inc.
 * Authored by: Brett Zabos (brett.zabos@viamo.io)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/
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
    // BacktrackingBehaviour,
];
/**
 * Block types that do not request additional input from an `IContact`
 */
exports.NON_INTERACTIVE_BLOCK_TYPES = ['Core.Case', 'Core.RunFlow'];
/**
 * A map of `IBlock.type` to an `TBlockRunnerFactory` function.
 */
function createDefaultBlockRunnerStore() {
    return new BlockRunnerFactoryStore([
        ['MobilePrimitives.Message', (block, ctx) => new __1.MessageBlockRunner(block, ctx)],
        ['MobilePrimitives.OpenResponse', (block, ctx) => new __1.OpenResponseBlockRunner(block, ctx)],
        ['MobilePrimitives.NumericResponse', (block, ctx) => new __1.NumericResponseBlockRunner(block, ctx)],
        ['MobilePrimitives.SelectOneResponse', (block, ctx) => new __1.SelectOneResponseBlockRunner(block, ctx)],
        ['MobilePrimitives.SelectManyResponse', (block, ctx) => new __1.SelectManyResponseBlockRunner(block, ctx)],
        ['Core.Case', (block, ctx) => new __1.CaseBlockRunner(block, ctx)],
        ['Core.Output', (block, ctx) => new __1.OutputBlockRunner(block, ctx)],
        ['Core.Log', (block, ctx) => new __1.LogBlockRunner(block, ctx)],
        ['ConsoleIO.Print', (block, ctx) => new __1.PrintBlockRunner(block, ctx)],
        ['Core.RunFlow', (block, ctx) => new __1.RunFlowBlockRunner(block, ctx)],
        [__1.SET_GROUP_MEMBERSHIP_BLOCK_TYPE, (block, ctx) => new __1.SetGroupMembershipBlockRunner(block, ctx)],
    ]);
}
exports.createDefaultBlockRunnerStore = createDefaultBlockRunnerStore;
/**
 * Main interface into this library.
 * @see README.md for usage details.
 */
// eslint-disable-next-line import/export
class FlowRunner {
    constructor(context, runnerFactoryStore = createDefaultBlockRunnerStore(), idGenerator = new __1.IdGeneratorUuidV4(), behaviours = {}, _contextService = __1.ContextService) {
        /** Map of block types to a factory producting an IBlockRunner instnace. */
        this.runnerFactoryStore = createDefaultBlockRunnerStore();
        /** Instance used to `generate()` unique IDs across interaction history. */
        this.idGenerator = new __1.IdGeneratorUuidV4();
        /** Instances providing isolated functionality beyond the default runner, leveraging built-in hooks. */
        this.behaviours = {};
        this._contextService = __1.ContextService;
        this._contextService = _contextService;
        this.behaviours = behaviours;
        this.idGenerator = idGenerator;
        this.runnerFactoryStore = runnerFactoryStore;
        this.context = context;
        this.initializeBehaviours(DEFAULT_BEHAVIOUR_TYPES);
    }
    /**
     * Take list of constructors and initialize them like: ```
     * runner.initializeBehaviours([MyFirstBehaviour, MySecondBehaviour])
     * runner.behaviours.myFirst instanceof MyFirstBehaviour
     * runner.behaviours.mySecond instanceof MySecondBehaviour
     * ``` */
    initializeBehaviours(behaviourConstructors) {
        behaviourConstructors.forEach(behaviourConstructor => (this.behaviours[(0, lodash_1.lowerFirst)((0, lodash_1.trimEnd)(behaviourConstructor.name, 'Behaviour|Behavior'))] = new behaviourConstructor(this.context, this, this)));
    }
    /**
     * Initialize entry point into this flow run; typically called internally.
     * Sets up first block, engages run state and entry timestamp on context.
     */
    initialize() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = this.context;
            const block = this.findNextBlockOnActiveFlowFor(ctx);
            if (block == null) {
                throw new __1.ValidationException('Unable to initialize flow without blocks.');
            }
            ctx.delivery_status = __1.DeliveryStatus.IN_PROGRESS;
            ctx.entry_at = (0, __1.createFormattedDate)();
            // kick-start by navigating to first block
            return this.navigateTo(block, this.context);
        });
    }
    /**
     * Verify whether or not we have a pointer in interaction history or not.
     * This identifies whether or not a run is in progress.
     * @param ctx
     */
    isInitialized(ctx) {
        // const {cursor, entryAt, exitAt} = ctx
        // return cursor && entryAt && !exitAt
        return ctx.cursor != null;
    }
    /**
     * Decipher whether or not cursor points to the first interactive block or not.
     */
    isFirst() {
        if (!this.isInitialized(this.context)) {
            return true;
        }
        const { interactions } = this.context;
        const firstInteractiveIntx = (0, lodash_1.find)(interactions, ({ type }) => !(0, lodash_1.includes)(exports.NON_INTERACTIVE_BLOCK_TYPES, type));
        if (firstInteractiveIntx == null) {
            return true;
        }
        return firstInteractiveIntx.uuid === this.context.cursor.interactionId;
    }
    /**
     * Decipher whether or not cursor points to the last block from interaction history.
     */
    isLast() {
        var _a;
        if (!this.isInitialized(this.context)) {
            return true;
        }
        const { interactions } = this.context;
        return ((_a = (0, lodash_1.last)(interactions)) === null || _a === void 0 ? void 0 : _a.uuid) === this.context.cursor.interactionId;
    }
    /**
     * Either begin or a resume a flow run, leveraging context instance member.
     */
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { context: ctx } = this;
            if (!this.isInitialized(ctx)) {
                yield this.initialize();
            }
            return this.runUntilInputRequiredFrom(ctx);
        });
    }
    /**
     * Decipher whether or not calling run() will be able to proceed or our cursor's prompt is in an invalid state.
     * @param ctx
     */
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
    // todo: this could be findFirstExitOnActiveFlowBlockFor to an Expressions Behaviour
    //       ie. cacheInteractionByBlockName, applyReversibleDataOperation and reverseLastDataOperation
    cacheInteractionByBlockName({ uuid, entry_at }, { name, config: { prompt } }, context = this.context) {
        if (!('block_interactions_by_block_name' in this.context.session_vars)) {
            context.session_vars.block_interactions_by_block_name = {};
        }
        if (context.reversible_operations == null) {
            context.reversible_operations = [];
        }
        // create a cache of `{[block.name]: {...}}` for subsequent lookups
        const blockNameKey = `block_interactions_by_block_name.${name}`;
        const previous = this.context.session_vars[blockNameKey];
        const resource = prompt == null ? undefined : new __1.ResourceResolver(context).resolve(prompt);
        const current = {
            __interactionId: uuid,
            time: entry_at,
            text: resource != null && resource.hasText() ? resource.getText() : '',
        };
        this.applyReversibleDataOperation({ $set: { [blockNameKey]: current } }, { $set: { [blockNameKey]: previous } });
    }
    /**
     * Apply a mutation to `session_vars` and operations in both directions.
     * These vars are made available in content Expressions.
     * @param forward
     * @param reverse
     * @param context
     */
    applyReversibleDataOperation(forward, reverse, context = this.context) {
        var _a;
        context.session_vars = (0, sp2_1.update)(context.session_vars, forward);
        context.reversible_operations.push({
            interactionId: (_a = (0, lodash_1.last)(context.interactions)) === null || _a === void 0 ? void 0 : _a.uuid,
            forward,
            reverse,
        });
    }
    /**
     * Pop last mutation to `session_vars` and apply its reversal operation.
     * @param context
     */
    reverseLastDataOperation(context = this.context) {
        if (context.reversible_operations.length === 0) {
            return;
        }
        const lastOperation = (0, lodash_1.last)(context.reversible_operations);
        context.session_vars = (0, sp2_1.update)(context.session_vars, lastOperation.reverse);
        return context.reversible_operations.pop();
    }
    /**
     * Pushes onward through the flow when cursor's prompt has been fulfilled and there are blocks to draw from.
     * This will continue running blocks until an interactive block is encountered and input is required from
     * the IContact.
     * Typically called internally.
     * @param ctx
     */
    runUntilInputRequiredFrom(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let richCursor = this.hydrateRichCursorFrom(ctx);
            let block = this._contextService.findBlockOnActiveFlowWith(richCursor.interaction.block_id, ctx);
            do {
                if (this.isInputRequiredFor(ctx)) {
                    console.info('Attempted to resume when prompt is not yet fulfilled; resurfacing same prompt instance.');
                    return richCursor;
                }
                yield this.runActiveBlockOn(richCursor, block);
                block = this.findNextBlockOnActiveFlowFor(ctx);
                while (block == null && this._contextService.isNested(ctx)) {
                    // nested flow complete, while more of parent flow remains
                    block = this.stepOut(ctx);
                }
                if (block == null) {
                    // bail-- we're done.
                    continue;
                }
                if (block.type === 'Core.RunFlow') {
                    richCursor = yield this.navigateTo(block, ctx);
                    block = this.stepInto(block, ctx);
                }
                if (block == null) {
                    // bail-- we done.
                    continue;
                }
                richCursor = yield this.navigateTo(block, ctx);
            } while (block != null);
            this.complete(ctx);
            return;
        });
    }
    // exitEarlyThrough(block: IBlock) {
    // todo: generate link from current interaction to exit block (flow.exitBlockId)
    // todo: raise if flow.exitBlockId not defined
    // todo: set delivery status on context as INCOMPLETE
    // }
    /**
     * Close off last interaction, push context status to complete, and write out exit timestamp.
     * Typically called internally.
     * @param ctx
     * @param completedAt
     */
    complete(ctx, completedAt = new Date()) {
        delete ctx.cursor;
        ctx.delivery_status = __1.DeliveryStatus.FINISHED_COMPLETE;
        ctx.exit_at = (0, __1.createFormattedDate)(completedAt);
    }
    /**
     * Seal up an [[IBlockInteraction]] with a timestamp once we've selected an exit.
     * @param intx
     * @param selectedExitId
     * @param completedAt
     */
    completeInteraction(intx, selectedExitId, completedAt = new Date()) {
        intx.exit_at = (0, __1.createFormattedDate)(completedAt);
        intx.selected_exit_id = selectedExitId;
        return intx;
    }
    /**
     * Seal up an interaction with an [[IRunFlowBlock]] which spans multiple child [[IBlockInteraction]]s.
     * This will apply a timestamp to parent [[IRunFlowBlock]]'s [[IBlockInteraction]], unnest active flow one level
     * and return the interaction for that parent [[IRunFlowBlock]].
     * @param ctx
     * @param completedAt
     */
    completeActiveNestedFlow(ctx, completedAt = new Date()) {
        const { nested_flow_block_interaction_id_stack } = ctx;
        if (!this._contextService.isNested(ctx)) {
            throw new __1.ValidationException('Unable to complete a nested flow when not nested.');
        }
        const runFlowIntx = this._contextService.findInteractionWith((0, lodash_1.last)(nested_flow_block_interaction_id_stack), ctx);
        // once we are in a valid state and able to find our corresponding interaction, let's update active nested flow
        nested_flow_block_interaction_id_stack.pop();
        // since we've un-nested one level, we may seek using freshly active flow
        const exit = this.findFirstExitOnActiveFlowBlockFor(runFlowIntx, ctx);
        return this.completeInteraction(runFlowIntx, exit.uuid, completedAt);
    }
    /**
     * Take a richCursor down to the bare minimum for JSON-serializability.
     * interaction IBlockInteraction reduced to its UUID
     * prompt IPrompt reduced to its raw config object.
     * Reverse of `hydrateRichCursorFrom()`.
     * @param richCursor
     */
    dehydrateCursor(richCursor) {
        return {
            interactionId: richCursor.interaction.uuid,
            promptConfig: richCursor.prompt != null ? richCursor.prompt.config : undefined,
        };
    }
    /**
     * Take raw cursor off an `IContext` and generate a richer, more detailed version; typically not JSON-serializable.
     * interactionId string UUID becomes full IBlockInteraction data object
     * promptConfig IPromptConfig becomes full-fledged Prompt instance corresponding to `kind`.
     * Reverse of `dehydrateCursor()`.
     * @param ctx
     */
    hydrateRichCursorFrom(ctx) {
        const { cursor } = ctx;
        const interaction = this._contextService.findInteractionWith(cursor.interactionId, ctx);
        const prompt = this.createPromptFrom(cursor.promptConfig, interaction);
        return { interaction, prompt };
    }
    /**
     * Generate an IBlockInteraction, apply `postInteractionCreate()` hooks over it,
     * generate cursor with full-fledged prompt.
     * @param block
     * @param flowId
     * @param originFlowId
     * @param originBlockInteractionId
     */
    initializeOneBlock(block, flowId, originFlowId, originBlockInteractionId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let interaction = yield this.createBlockInteractionFor(block, flowId, originFlowId, originBlockInteractionId);
            Object.values(this.behaviours).forEach(b => (interaction = b.postInteractionCreate(interaction, this.context)));
            return { interaction, prompt: undefined };
        });
    }
    /**
     * Type guard providing insight into whether or not prompt presence can be relied upon.
     * @param richCursor
     */
    isRichCursorInputRequired(richCursor) {
        return richCursor.prompt != null;
    }
    /**
     * Apply prompt value onto IBlockInteraction, complete IBlockRunner execution, mark prompt as having been submitted,
     * apply `postInteractionComplete()` hooks over it, and return IBlockRunner's selected exit.
     * @param richCursor
     * @param block
     */
    runActiveBlockOn(richCursor, block) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { interaction } = richCursor;
            (0, __1.assertNotNull)(interaction, () => 'Unable to run with absent cursor interaction', errorMessage => new __1.ValidationException(errorMessage));
            if (this.isRichCursorInputRequired(richCursor) && richCursor.prompt.config.isSubmitted) {
                throw new __1.ValidationException('Unable to run against previously processed prompt');
            }
            if (this.isRichCursorInputRequired(richCursor)) {
                interaction.value = richCursor.prompt.value;
                interaction.has_response = interaction.value != null;
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
    /**
     * Produce an IBlockRunner instance leveraging `runnerFactoryStore` and `IBlock.type`.
     * Raises when `ValidationException` when not found.
     * @param block
     * @param ctx
     */
    createBlockRunnerFor(block, ctx) {
        const factory = this.runnerFactoryStore.get(block.type);
        if (factory == null) {
            // todo: need to pass as no-op for beta
            throw new __1.ValidationException(`Unable to find factory for block type: ${block.type}`);
        }
        return factory(block, ctx);
    }
    /**
     * Initialize a block, close off any open past interaction, push newly initialized interaction onto history stack
     * and apply new cursor onto context.
     * @param block
     * @param ctx
     */
    navigateTo(block, ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const richCursor = yield this._inflateInteractionAndContainerCursorFor(block, ctx);
            this._activateCursorOnto(ctx, richCursor);
            yield this._inflatePromptForBlockOnto(richCursor, block, ctx);
            // todo: this could be findFirstExitOnActiveFlowBlockFor to an Expressions Behaviour
            this.cacheInteractionByBlockName(richCursor.interaction, block, ctx);
            return richCursor;
        });
    }
    _activateCursorOnto(ctx, richCursor) {
        ctx.cursor = this.dehydrateCursor(richCursor);
    }
    _inflateInteractionAndContainerCursorFor(block, ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { nested_flow_block_interaction_id_stack } = ctx;
            const flowId = this._contextService.getActiveFlowIdFrom(ctx);
            const originInteractionId = (0, lodash_1.last)(nested_flow_block_interaction_id_stack);
            const originInteraction = originInteractionId != null ? this._contextService.findInteractionWith(originInteractionId, ctx) : null;
            const richCursor = yield this.initializeOneBlock(block, flowId, originInteraction == null ? undefined : originInteraction.flow_id, originInteractionId);
            const { interactions } = ctx;
            interactions.push(richCursor.interaction);
            return richCursor;
        });
    }
    /**
     * Stepping into is the act of moving into a child flow.
     * However, we can't move into a child flow without a cursor indicating we've moved.
     * `stepInto()` needs to be the thing that discovers ya from xa (via first on flow in flows list)
     * Then generating a cursor that indicates where we are.
     * ?? -> xa ->>> ya -> yb ->>> xb
     *
     * todo: would it be possible for stepping into and out of be handled by the RunFlow itself?
     *       Eg. these are esentially RunFlowRunner's .start() + .resume() equivalents */
    stepInto(runFlowBlock, ctx) {
        if (runFlowBlock.type !== 'Core.RunFlow') {
            throw new __1.ValidationException('Unable to step into a non-Core.RunFlow block type');
        }
        const runFlowInteraction = (0, lodash_1.last)(ctx.interactions);
        if (runFlowInteraction == null) {
            throw new __1.ValidationException("Unable to step into Core.RunFlow that hasn't yet been started");
        }
        if (runFlowBlock.uuid !== runFlowInteraction.block_id) {
            throw new __1.ValidationException("Unable to step into Core.RunFlow block that doesn't match last interaction");
        }
        ctx.nested_flow_block_interaction_id_stack.push(runFlowInteraction.uuid);
        const firstNestedBlock = (0, lodash_1.first)(this._contextService.getActiveFlowFrom(ctx).blocks);
        // todo: use IFlow.firstBlockId
        if (firstNestedBlock == null) {
            return;
        }
        return firstNestedBlock;
    }
    /**
     * Stepping out is the act of moving back into parent flow.
     * However, we can't move up into parent flow without a cursor indicating we've moved.
     * `stepOut()` needs to be the things that discovers xb from xa (via nfbistack)
     * Then generating a cursor that indicates where we are.
     * ?? -> xa ->>> ya -> yb ->>> xb
     *
     * @note Does this push cursor into an out-of-sync state?
     *       Not when stepping out, because when stepping out, we're connecting previous RunFlow output
     *       to next block; when stepping IN, we need an explicit navigation to inject RunFlow in between
     *       the two Flows. */
    stepOut(ctx) {
        return this.findNextBlockFrom(this.completeActiveNestedFlow(ctx), ctx);
    }
    findFirstExitOnActiveFlowBlockFor({ block_id }, ctx) {
        const { exits } = this._contextService.findBlockOnActiveFlowWith(block_id, ctx);
        return (0, lodash_1.first)(exits);
    }
    /**
     * Find the active flow, then return first block on that flow if we've yet to initialize,
     * otherwise leverage current interaction's selected exit pointer.
     * @param ctx
     */
    findNextBlockOnActiveFlowFor(ctx) {
        const flow = this._contextService.getActiveFlowFrom(ctx);
        const { cursor } = ctx;
        if (cursor == null) {
            // todo: use IFlow.firstBlockId
            return (0, lodash_1.first)(flow.blocks);
        }
        const interaction = this._contextService.findInteractionWith(cursor.interactionId, ctx);
        return this.findNextBlockFrom(interaction, ctx);
    }
    /**
     * Find next block leveraging destinationBlock on current interaction's `selectedExit`.
     * Raises when `selectedExitId` absent.
     * @param block_id
     * @param selectedExitId
     * @param ctx
     */
    findNextBlockFrom({ block_id, selected_exit_id }, ctx) {
        if (selected_exit_id == null) {
            // todo: maybe tighten check on this, like: prompt.isFulfilled() === false || !called block.run()
            throw new __1.ValidationException('Unable to navigate past incomplete interaction; did you forget to call runner.run()?');
        }
        const block = this._contextService.findBlockOnActiveFlowWith(block_id, ctx);
        const { destination_block } = (0, __1.findBlockExitWith)(selected_exit_id, block);
        const { blocks } = this._contextService.getActiveFlowFrom(ctx);
        return (0, lodash_1.find)(blocks, { uuid: destination_block });
    }
    /**
     * Generate a concrete `IBlockInteraction` data object, pre-populated with:
     * - UUID via `IIdGenerator.generate()`
     * - entryAt via current timestamp
     * - flowId (provisioned)
     * - block_id via block.uuid
     * - type via block.type provisioned
     * - hasResponse as `false`
     * @param block_id
     * @param type
     * @param flowId
     * @param originFlowId
     * @param originBlockInteractionId
     */
    createBlockInteractionFor({ uuid: block_id, type }, flowId, originFlowId, originBlockInteractionId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return {
                uuid: yield this.idGenerator.generate(),
                block_id: block_id,
                flow_id: flowId,
                entry_at: (0, __1.createFormattedDate)(),
                exit_at: undefined,
                has_response: false,
                value: undefined,
                selected_exit_id: undefined,
                details: {},
                type,
                // Nested flows behaviour:
                origin_flow_id: originFlowId,
                origin_block_interaction_id: originBlockInteractionId,
            };
        });
    }
    _inflatePromptForBlockOnto(richCursor, block, ctx) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            richCursor.prompt = yield this.buildPromptFor(block, richCursor.interaction);
            ctx.cursor.promptConfig = (_a = richCursor.prompt) === null || _a === void 0 ? void 0 : _a.config;
        });
    }
    /**
     * Build a prompt using block's corresponding `IBlockRunner.initialize()` configurator and promptKeyToPromptConstructorMap() to
     * discover prompt constructor.
     * @param block
     * @param interaction
     */
    buildPromptFor(block, interaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const runner = this.createBlockRunnerFor(block, this.context);
            const promptConfig = yield runner.initialize(interaction);
            return this.createPromptFrom(promptConfig, interaction);
        });
    }
    /**
     * New up prompt instance from an IPromptConfig, assuming kind exists in `promptKeyToPromptConstructorMap()`,
     * resulting in null when either config or interaction are absent.
     * @param config
     * @param interaction
     */
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
/**
 * Namespacing must be used, because otherwise, Builder can not be referenced, without resulting in a compiler error,
 * due to this not being able to resolve the FlowRunner.Builder type, because the Builder is transpiled to an object definition
 */
(function (FlowRunner) {
    // noinspection JSUnusedGlobalSymbols
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
            (0, __1.assertNotNull)(this.context, () => 'FlowRunner.Builder.setContext() must be called before FlowRunner.Builder.build()');
            return new FlowRunner(this.context, this.runnerFactoryStore, this.idGenerator, this.behaviours, this._contextService);
        }
    }
    FlowRunner.Builder = Builder;
})(FlowRunner = exports.FlowRunner || (exports.FlowRunner = {}));
//# sourceMappingURL=FlowRunner.js.map