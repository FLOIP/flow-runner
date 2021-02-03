"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BacktrackingBehaviour = void 0;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const __1 = require("../../..");
class BacktrackingBehaviour {
    constructor(context, navigator, promptBuilder) {
        this.context = context;
        this.navigator = navigator;
        this.promptBuilder = promptBuilder;
        this.initializeBacktrackingContext();
    }
    initializeBacktrackingContext() {
        const meta = this.context.platform_metadata;
        if (meta.backtracking == null) {
            meta.backtracking = {
                cursor: __1.createKey(),
                interactionStack: __1.createStack(),
                ghostInteractionStacks: [],
            };
        }
        if (meta.backtracking.interactionStack == null || meta.backtracking.cursor == null) {
            meta.backtracking.cursor = __1.createKey();
            meta.backtracking.interactionStack = __1.createStack();
            this.rebuildIndex();
        }
    }
    hasIndex() {
        const meta = this.context.platform_metadata;
        return meta.backtracking.interactionStack != null && meta.backtracking.cursor != null;
    }
    rebuildIndex() {
        const { backtracking } = this.context.platform_metadata;
        const key = (backtracking.cursor = __1.createKey());
        const stack = (backtracking.interactionStack = __1.createStack());
        this.context.interactions.forEach(intx => this.insertInteractionUsing(key, intx, stack));
    }
    insertInteractionUsing(key, interaction, interactionStack) {
        const keyForIntxOfRepeatedBlock = __1.shallowIndexOfRightFrom(key, interactionStack, intx => intx.blockId === interaction.blockId);
        if (keyForIntxOfRepeatedBlock != null) {
            this._stepIn(key, interactionStack, keyForIntxOfRepeatedBlock, interaction);
            return;
        }
        const keyToBeginningOfStackWithHeadMatchingBlock = __1.findHeadRightFrom(key, interactionStack, intx => intx.blockId === interaction.blockId);
        if (keyToBeginningOfStackWithHeadMatchingBlock != null) {
            this._stepOut(keyToBeginningOfStackWithHeadMatchingBlock, interactionStack, interaction, key);
            return;
        }
        lodash_1.last(key)[__1.STACK_KEY_ITERATION_INDEX] = __1._append(interaction, __1.getStackFor(key, interactionStack)) - 1;
    }
    _stepOut(keyToBeginningOfStackWithHeadMatchingBlock, interactionStack, interaction, key) {
        const stack = __1.getStackFor(keyToBeginningOfStackWithHeadMatchingBlock, interactionStack);
        __1._loop(stack, [interaction]);
        const newStackKey = __1.createStackKeyForLastIterAndLastIndexOf(stack);
        __1.moveStackIndexTo(newStackKey, keyToBeginningOfStackWithHeadMatchingBlock);
        key.splice(0, Number.MAX_VALUE, ...keyToBeginningOfStackWithHeadMatchingBlock);
    }
    _stepIn(key, interactionStack, keyForIntxOfRepeatedBlock, interaction) {
        const iteration = __1.getIterationFor(key, interactionStack);
        const i = lodash_1.last(keyForIntxOfRepeatedBlock)[__1.STACK_KEY_ITERATION_INDEX];
        const nestedIteration = iteration.splice(i);
        const nestedStack = __1.createStack(nestedIteration);
        iteration.push(nestedStack);
        __1._loop(nestedStack, [interaction]);
        lodash_1.last(key)[__1.STACK_KEY_ITERATION_INDEX] = i;
        key.push(__1.createStackKey(1, 0));
    }
    jumpTo(interaction, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { backtracking } = this.context.platform_metadata;
            const keyForLastOccurrenceOfInteraction = __1.deepIndexOfFrom(__1.createKey(), backtracking.interactionStack, ({ uuid }) => uuid === interaction.uuid);
            if (keyForLastOccurrenceOfInteraction == null) {
                throw new __1.ValidationException('Unable to find destination interaction in backtracking stack for jumpTo()');
            }
            backtracking.ghostInteractionStacks.push(lodash_1.cloneDeep(backtracking.interactionStack));
            const discarded = context.interactions.splice(lodash_1.findLastIndex(context.interactions, interaction), context.interactions.length);
            lodash_1.forEachRight(discarded, intx => intx.uuid === lodash_1.last(context.nested_flow_block_interaction_id_stack) ? context.nested_flow_block_interaction_id_stack.pop() : null);
            const deepestStackKeyForIntx = lodash_1.last(keyForLastOccurrenceOfInteraction);
            const keyToTruncateFrom = __1.cloneKeyAndMoveTo(__1.createStackKey(deepestStackKeyForIntx[__1.STACK_KEY_ITERATION_NUMBER], deepestStackKeyForIntx[__1.STACK_KEY_ITERATION_INDEX] - 1), keyForLastOccurrenceOfInteraction, backtracking.interactionStack);
            __1.deepTruncateIterationsFrom(keyToTruncateFrom, backtracking.interactionStack);
            backtracking.cursor = keyToTruncateFrom;
            return this.navigator.navigateTo(__1.findBlockOnActiveFlowWith(interaction.blockId, this.context), this.context);
        });
    }
    peek(steps = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let _steps = steps;
            const intx = lodash_1.findLast(this.context.interactions, ({ type }) => !lodash_1.includes(__1.NON_INTERACTIVE_BLOCK_TYPES, type) && --_steps === 0);
            if (intx == null || _steps > 0) {
                throw new __1.ValidationException(`Unable to backtrack to an interaction that far back ${JSON.stringify({ steps })}`);
            }
            const block = __1.findBlockWith(intx.blockId, __1.findFlowWith(intx.flowId, this.context));
            const prompt = yield this.promptBuilder.buildPromptFor(block, intx);
            if (prompt == null) {
                throw new __1.ValidationException(`Unable to build a prompt for ${JSON.stringify({
                    context: this.context.id,
                    intx,
                    block,
                })}`);
            }
            return Object.assign(prompt, { value: intx.value });
        });
    }
    findIndexOfSuggestionFor({ blockId }, key, stack) {
        const keyForSuggestion = __1.deepIndexOfFrom(key, stack, intx => intx.blockId === blockId);
        if (keyForSuggestion != null) {
            return keyForSuggestion;
        }
        const lastIndexOfIteration = __1.getIterationFor(key, stack).length - 1;
        const shouldCheckNextIteration = lodash_1.last(key)[__1.STACK_KEY_ITERATION_INDEX] === lastIndexOfIteration;
        if (!shouldCheckNextIteration) {
            return;
        }
        const keyForNextIteration = __1.moveStackIndexTo(__1.createStackKey(0, 0), lodash_1.cloneDeep(key));
        return __1.deepIndexOfFrom(keyForNextIteration, stack, intx => intx.blockId === blockId);
    }
    postInteractionCreate(interaction, _context) {
        const { backtracking: { cursor: key, ghostInteractionStacks, }, } = this.context.platform_metadata;
        if (ghostInteractionStacks.length === 0) {
            return interaction;
        }
        if (!this.hasIndex()) {
            this.rebuildIndex();
        }
        const lastGhost = lodash_1.last(ghostInteractionStacks);
        if (lastGhost == null) {
            throw new Error('whups no ghost');
        }
        const keyForSuggestion = this.findIndexOfSuggestionFor(interaction, key, lastGhost);
        if (keyForSuggestion == null) {
            return interaction;
        }
        interaction.value = __1.getEntityAt(keyForSuggestion, lastGhost).value;
        if (keyForSuggestion.join() !== key.join()) {
            ghostInteractionStacks.forEach((ghostInteractionStack) => this.syncGhostTo(key, keyForSuggestion, ghostInteractionStack));
        }
        return interaction;
    }
    syncGhostTo(key, keyForSuggestion, ghost) {
        if (keyForSuggestion.length < key.length) {
            throw new __1.ValidationException(`Unable to sync up ghost; ${JSON.stringify({ key, keyForSuggestion })}`);
        }
        if (keyForSuggestion.length === key.length && keyForSuggestion.toString() === key.toString()) {
            return;
        }
        let isAtGreaterDepth = keyForSuggestion.length > key.length;
        let stackKeyForSuggestion = lodash_1.last(keyForSuggestion);
        const iterationForSuggestion = __1.getIterationFor(keyForSuggestion, ghost);
        const remainderOfCurrentGhostIteration = iterationForSuggestion.splice(stackKeyForSuggestion[__1.STACK_KEY_ITERATION_INDEX], Number.MAX_VALUE);
        let wasEmptyStackLeftOver = false;
        if (isAtGreaterDepth) {
            const { stack } = __1.getStackFor(keyForSuggestion, ghost);
            stack.splice(0, stackKeyForSuggestion[__1.STACK_KEY_ITERATION_NUMBER] + 1);
            wasEmptyStackLeftOver = stack.length === 0;
            keyForSuggestion.pop();
        }
        stackKeyForSuggestion = lodash_1.last(keyForSuggestion);
        const deepestStackKeyIndex = keyForSuggestion.length === key.length ? lodash_1.last(key)[__1.STACK_KEY_ITERATION_INDEX] : stackKeyForSuggestion[__1.STACK_KEY_ITERATION_INDEX];
        isAtGreaterDepth = keyForSuggestion.length > key.length;
        const itemsBetweenKeyAndGhost = isAtGreaterDepth
            ? 0
            : stackKeyForSuggestion[__1.STACK_KEY_ITERATION_INDEX] - deepestStackKeyIndex;
        const containingIterationForSuggestion = __1.getIterationFor(keyForSuggestion, ghost);
        containingIterationForSuggestion.splice(deepestStackKeyIndex, itemsBetweenKeyAndGhost + (wasEmptyStackLeftOver ? 1 : 0), ...remainderOfCurrentGhostIteration);
        if (isAtGreaterDepth) {
            this.syncGhostTo(key, keyForSuggestion, ghost);
        }
    }
    postInteractionComplete(interaction, _context) {
        const { backtracking: { cursor: key, interactionStack, ghostInteractionStacks }, } = this.context.platform_metadata;
        this.insertInteractionUsing(key, interaction, interactionStack);
        if (ghostInteractionStacks.length === 0) {
            return;
        }
        ghostInteractionStacks.forEach(ghostInteractionStack => {
            const ghostIntx = __1.forceGet(key, ghostInteractionStack);
            if (!__1.isEntity(ghostIntx) || lodash_1.isEqual(interaction.value, ghostIntx.value)) {
                return;
            }
            __1.truncateIterationFrom(key, ghostInteractionStack);
        });
    }
}
exports.BacktrackingBehaviour = BacktrackingBehaviour;
//# sourceMappingURL=BacktrackingBehaviour.js.map