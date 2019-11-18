"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var IContext_1 = require("../../../flow-spec/IContext");
var HierarchicalIterStack_1 = require("./HierarchicalIterStack");
var ValidationException_1 = tslib_1.__importDefault(require("../../exceptions/ValidationException"));
var FlowRunner_1 = require("../../FlowRunner");
var __1 = require("../../..");
var BacktrackingBehaviour = (function () {
    function BacktrackingBehaviour(context, navigator, promptBuilder) {
        this.context = context;
        this.navigator = navigator;
        this.promptBuilder = promptBuilder;
        this.initializeBacktrackingContext();
    }
    BacktrackingBehaviour.prototype.initializeBacktrackingContext = function () {
        var meta = this.context.platformMetadata;
        if (meta.backtracking == null) {
            meta.backtracking = {
                cursor: HierarchicalIterStack_1.createKey(),
                interactionStack: HierarchicalIterStack_1.createStack(),
                ghostInteractionStacks: [],
            };
        }
        if (meta.backtracking.interactionStack == null
            || meta.backtracking.cursor == null) {
            meta.backtracking.cursor = HierarchicalIterStack_1.createKey();
            meta.backtracking.interactionStack = HierarchicalIterStack_1.createStack();
            this.rebuildIndex();
        }
    };
    BacktrackingBehaviour.prototype.hasIndex = function () {
        var meta = this.context.platformMetadata;
        return meta.backtracking.interactionStack != null
            && meta.backtracking.cursor != null;
    };
    BacktrackingBehaviour.prototype.rebuildIndex = function () {
        var _this = this;
        var backtracking = this.context.platformMetadata.backtracking;
        var key = backtracking.cursor = HierarchicalIterStack_1.createKey();
        var stack = backtracking.interactionStack = HierarchicalIterStack_1.createStack();
        this.context.interactions.forEach(function (intx) { return _this.insertInteractionUsing(key, intx, stack); });
    };
    BacktrackingBehaviour.prototype.insertInteractionUsing = function (key, interaction, interactionStack) {
        var keyForIntxOfRepeatedBlock = HierarchicalIterStack_1.shallowIndexOfRightFrom(key, interactionStack, function (intx) { return intx.blockId === interaction.blockId; });
        if (keyForIntxOfRepeatedBlock != null) {
            this._stepIn(key, interactionStack, keyForIntxOfRepeatedBlock, interaction);
            return;
        }
        var keyToBeginningOfStackWithHeadMatchingBlock = HierarchicalIterStack_1.findHeadRightFrom(key, interactionStack, function (intx) { return intx.blockId === interaction.blockId; });
        if (keyToBeginningOfStackWithHeadMatchingBlock != null) {
            this._stepOut(keyToBeginningOfStackWithHeadMatchingBlock, interactionStack, interaction, key);
            return;
        }
        lodash_1.last(key)[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX] = HierarchicalIterStack_1._append(interaction, HierarchicalIterStack_1.getStackFor(key, interactionStack)) - 1;
    };
    BacktrackingBehaviour.prototype._stepOut = function (keyToBeginningOfStackWithHeadMatchingBlock, interactionStack, interaction, key) {
        var stack = HierarchicalIterStack_1.getStackFor(keyToBeginningOfStackWithHeadMatchingBlock, interactionStack);
        HierarchicalIterStack_1._loop(stack, [interaction]);
        var newStackKey = HierarchicalIterStack_1.createStackKeyForLastIterAndLastIndexOf(stack);
        HierarchicalIterStack_1.moveStackIndexTo(newStackKey, keyToBeginningOfStackWithHeadMatchingBlock);
        key.splice.apply(key, tslib_1.__spreadArrays([0, Number.MAX_VALUE], keyToBeginningOfStackWithHeadMatchingBlock));
    };
    BacktrackingBehaviour.prototype._stepIn = function (key, interactionStack, keyForIntxOfRepeatedBlock, interaction) {
        var iteration = HierarchicalIterStack_1.getIterationFor(key, interactionStack);
        var i = lodash_1.last(keyForIntxOfRepeatedBlock)[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX];
        var nestedIteration = iteration.splice(i);
        var nestedStack = HierarchicalIterStack_1.createStack(nestedIteration);
        iteration.push(nestedStack);
        HierarchicalIterStack_1._loop(nestedStack, [interaction]);
        lodash_1.last(key)[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX] = i;
        key.push(HierarchicalIterStack_1.createStackKey(1, 0));
    };
    BacktrackingBehaviour.prototype.jumpTo = function (interaction, context) {
        var backtracking = this.context.platformMetadata.backtracking;
        var keyForLastOccurrenceOfInteraction = HierarchicalIterStack_1.deepIndexOfFrom(HierarchicalIterStack_1.createKey(), backtracking.interactionStack, function (_a) {
            var uuid = _a.uuid;
            return uuid === interaction.uuid;
        });
        if (keyForLastOccurrenceOfInteraction == null) {
            throw new ValidationException_1.default('Unable to find destination interaction in backtracking stack for jumpTo()');
        }
        backtracking.ghostInteractionStacks.push(lodash_1.cloneDeep(backtracking.interactionStack));
        var discarded = context.interactions.splice(lodash_1.findLastIndex(context.interactions, interaction), context.interactions.length);
        lodash_1.forEachRight(discarded, function (intx) { return intx.uuid === lodash_1.last(context.nestedFlowBlockInteractionIdStack)
            ? context.nestedFlowBlockInteractionIdStack.pop()
            : null; });
        var deepestStackKeyForIntx = lodash_1.last(keyForLastOccurrenceOfInteraction);
        var keyToTruncateFrom = HierarchicalIterStack_1.cloneKeyAndMoveTo(HierarchicalIterStack_1.createStackKey(deepestStackKeyForIntx[HierarchicalIterStack_1.STACK_KEY_ITERATION_NUMBER], deepestStackKeyForIntx[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX] - 1), keyForLastOccurrenceOfInteraction, backtracking.interactionStack);
        HierarchicalIterStack_1.deepTruncateIterationsFrom(keyToTruncateFrom, backtracking.interactionStack);
        backtracking.cursor = keyToTruncateFrom;
        return this.navigator.navigateTo(IContext_1.findBlockOnActiveFlowWith(interaction.blockId, this.context), this.context);
    };
    BacktrackingBehaviour.prototype.peek = function (steps) {
        if (steps === void 0) { steps = 1; }
        var _steps = steps;
        var intx = lodash_1.findLast(this.context.interactions, function (_a) {
            var type = _a.type;
            return !lodash_1.includes(FlowRunner_1.NON_INTERACTIVE_BLOCK_TYPES, type) && --_steps === 0;
        });
        if (intx == null || _steps > 0) {
            throw new ValidationException_1.default("Unable to backtrack to an interaction that far back " + JSON.stringify({ steps: steps }));
        }
        var block = __1.findBlockWith(intx.blockId, IContext_1.findFlowWith(intx.flowId, this.context));
        var prompt = this.promptBuilder.buildPromptFor(block, intx);
        if (prompt == null) {
            throw new ValidationException_1.default("Unable to build a prompt for " + JSON.stringify({
                context: this.context.id,
                intx: intx,
                block: block
            }));
        }
        return Object.assign(prompt, { value: intx.value });
    };
    BacktrackingBehaviour.prototype.findIndexOfSuggestionFor = function (_a, key, stack) {
        var blockId = _a.blockId;
        var keyForSuggestion = HierarchicalIterStack_1.deepIndexOfFrom(key, stack, function (intx) { return intx.blockId === blockId; });
        if (keyForSuggestion != null) {
            return keyForSuggestion;
        }
        var lastIndexOfIteration = HierarchicalIterStack_1.getIterationFor(key, stack).length - 1;
        var shouldCheckNextIteration = lodash_1.last(key)[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX] === lastIndexOfIteration;
        if (!shouldCheckNextIteration) {
            return;
        }
        var keyForNextIteration = HierarchicalIterStack_1.moveStackIndexTo(HierarchicalIterStack_1.createStackKey(0, 0), lodash_1.cloneDeep(key));
        return HierarchicalIterStack_1.deepIndexOfFrom(keyForNextIteration, stack, function (intx) { return intx.blockId === blockId; });
    };
    BacktrackingBehaviour.prototype.postInteractionCreate = function (interaction, _context) {
        var _this = this;
        var _a = this.context.platformMetadata.backtracking, key = _a.cursor, ghostInteractionStacks = _a.ghostInteractionStacks;
        if (ghostInteractionStacks.length === 0) {
            return interaction;
        }
        if (!this.hasIndex()) {
            this.rebuildIndex();
        }
        var lastGhost = lodash_1.last(ghostInteractionStacks);
        if (lastGhost == null) {
            throw new Error('whups no ghost');
        }
        var keyForSuggestion = this.findIndexOfSuggestionFor(interaction, key, lastGhost);
        if (keyForSuggestion == null) {
            return interaction;
        }
        interaction.value = HierarchicalIterStack_1.getEntityAt(keyForSuggestion, lastGhost).value;
        if (keyForSuggestion.join() !== key.join()) {
            ghostInteractionStacks.forEach(function (ghostInteractionStack) {
                return _this.syncGhostTo(key, keyForSuggestion, ghostInteractionStack);
            });
        }
        return interaction;
    };
    BacktrackingBehaviour.prototype.syncGhostTo = function (key, keyForSuggestion, ghost) {
        if (keyForSuggestion.length < key.length) {
            throw new ValidationException_1.default("Unable to sync up ghost; " + JSON.stringify({ key: key, keyForSuggestion: keyForSuggestion }));
        }
        if (keyForSuggestion.length === key.length && keyForSuggestion.toString() === key.toString()) {
            return;
        }
        var isAtGreaterDepth = keyForSuggestion.length > key.length;
        var stackKeyForSuggestion = lodash_1.last(keyForSuggestion);
        var iterationForSuggestion = HierarchicalIterStack_1.getIterationFor(keyForSuggestion, ghost);
        var remainderOfCurrentGhostIteration = iterationForSuggestion.splice(stackKeyForSuggestion[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX], Number.MAX_VALUE);
        var wasEmptyStackLeftOver = false;
        if (isAtGreaterDepth) {
            var stack = HierarchicalIterStack_1.getStackFor(keyForSuggestion, ghost).stack;
            stack.splice(0, stackKeyForSuggestion[HierarchicalIterStack_1.STACK_KEY_ITERATION_NUMBER] + 1);
            wasEmptyStackLeftOver = stack.length === 0;
            keyForSuggestion.pop();
        }
        stackKeyForSuggestion = lodash_1.last(keyForSuggestion);
        var deepestStackKeyIndex = keyForSuggestion.length === key.length
            ? lodash_1.last(key)[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX]
            : stackKeyForSuggestion[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX];
        isAtGreaterDepth = keyForSuggestion.length > key.length;
        var itemsBetweenKeyAndGhost = isAtGreaterDepth
            ? 0
            : (stackKeyForSuggestion[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX] - deepestStackKeyIndex);
        var containingIterationForSuggestion = HierarchicalIterStack_1.getIterationFor(keyForSuggestion, ghost);
        containingIterationForSuggestion.splice.apply(containingIterationForSuggestion, tslib_1.__spreadArrays([deepestStackKeyIndex,
            itemsBetweenKeyAndGhost + (wasEmptyStackLeftOver ? 1 : 0)], remainderOfCurrentGhostIteration));
        if (isAtGreaterDepth) {
            this.syncGhostTo(key, keyForSuggestion, ghost);
        }
    };
    BacktrackingBehaviour.prototype.postInteractionComplete = function (interaction, _context) {
        var _a = this.context.platformMetadata.backtracking, key = _a.cursor, interactionStack = _a.interactionStack, ghostInteractionStacks = _a.ghostInteractionStacks;
        this.insertInteractionUsing(key, interaction, interactionStack);
        if (ghostInteractionStacks.length === 0) {
            return;
        }
        ghostInteractionStacks.forEach(function (ghostInteractionStack) {
            var ghostIntx = HierarchicalIterStack_1.forceGet(key, ghostInteractionStack);
            if (!HierarchicalIterStack_1.isEntity(ghostIntx)
                || lodash_1.isEqual(interaction.value, ghostIntx.value)) {
                return;
            }
            HierarchicalIterStack_1.truncateIterationFrom(key, ghostInteractionStack);
        });
    };
    return BacktrackingBehaviour;
}());
exports.default = BacktrackingBehaviour;
//# sourceMappingURL=BacktrackingBehaviour.js.map