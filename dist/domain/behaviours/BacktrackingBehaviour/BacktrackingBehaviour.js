"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const IContext_1 = require("../../../flow-spec/IContext");
const HierarchicalIterStack_1 = require("./HierarchicalIterStack");
const ValidationException_1 = tslib_1.__importDefault(require("../../exceptions/ValidationException"));
const FlowRunner_1 = require("../../FlowRunner");
const __1 = require("../../..");
class BacktrackingBehaviour {
    constructor(context, navigator, promptBuilder) {
        this.context = context;
        this.navigator = navigator;
        this.promptBuilder = promptBuilder;
        this.initializeBacktrackingContext();
    }
    initializeBacktrackingContext() {
        const meta = this.context.platformMetadata;
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
    }
    hasIndex() {
        const meta = this.context.platformMetadata;
        return meta.backtracking.interactionStack != null
            && meta.backtracking.cursor != null;
    }
    rebuildIndex() {
        const { backtracking, } = this.context.platformMetadata;
        const key = backtracking.cursor = HierarchicalIterStack_1.createKey();
        const stack = backtracking.interactionStack = HierarchicalIterStack_1.createStack();
        this.context.interactions.forEach(intx => this.insertInteractionUsing(key, intx, stack));
    }
    insertInteractionUsing(key, interaction, interactionStack) {
        const keyForIntxOfRepeatedBlock = HierarchicalIterStack_1.shallowIndexOfRightFrom(key, interactionStack, intx => intx.blockId === interaction.blockId);
        if (keyForIntxOfRepeatedBlock != null) {
            this._stepIn(key, interactionStack, keyForIntxOfRepeatedBlock, interaction);
            return;
        }
        const keyToBeginningOfStackWithHeadMatchingBlock = HierarchicalIterStack_1.findHeadRightFrom(key, interactionStack, intx => intx.blockId === interaction.blockId);
        if (keyToBeginningOfStackWithHeadMatchingBlock != null) {
            this._stepOut(keyToBeginningOfStackWithHeadMatchingBlock, interactionStack, interaction, key);
            return;
        }
        lodash_1.last(key)[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX] = HierarchicalIterStack_1._append(interaction, HierarchicalIterStack_1.getStackFor(key, interactionStack)) - 1;
    }
    _stepOut(keyToBeginningOfStackWithHeadMatchingBlock, interactionStack, interaction, key) {
        const stack = HierarchicalIterStack_1.getStackFor(keyToBeginningOfStackWithHeadMatchingBlock, interactionStack);
        HierarchicalIterStack_1._loop(stack, [interaction]);
        const newStackKey = HierarchicalIterStack_1.createStackKeyForLastIterAndLastIndexOf(stack);
        HierarchicalIterStack_1.moveStackIndexTo(newStackKey, keyToBeginningOfStackWithHeadMatchingBlock);
        key.splice(0, Number.MAX_VALUE, ...keyToBeginningOfStackWithHeadMatchingBlock);
    }
    _stepIn(key, interactionStack, keyForIntxOfRepeatedBlock, interaction) {
        const iteration = HierarchicalIterStack_1.getIterationFor(key, interactionStack);
        const i = lodash_1.last(keyForIntxOfRepeatedBlock)[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX];
        const nestedIteration = iteration.splice(i);
        const nestedStack = HierarchicalIterStack_1.createStack(nestedIteration);
        iteration.push(nestedStack);
        HierarchicalIterStack_1._loop(nestedStack, [interaction]);
        lodash_1.last(key)[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX] = i;
        key.push(HierarchicalIterStack_1.createStackKey(1, 0));
    }
    jumpTo(interaction, context) {
        const { backtracking, } = this.context.platformMetadata;
        const keyForLastOccurrenceOfInteraction = HierarchicalIterStack_1.deepIndexOfFrom(HierarchicalIterStack_1.createKey(), backtracking.interactionStack, ({ uuid }) => uuid === interaction.uuid);
        if (keyForLastOccurrenceOfInteraction == null) {
            throw new ValidationException_1.default('Unable to find destination interaction in backtracking stack for jumpTo()');
        }
        backtracking.ghostInteractionStacks.push(lodash_1.cloneDeep(backtracking.interactionStack));
        const discarded = context.interactions.splice(lodash_1.findLastIndex(context.interactions, interaction), context.interactions.length);
        lodash_1.forEachRight(discarded, intx => intx.uuid === lodash_1.last(context.nestedFlowBlockInteractionIdStack)
            ? context.nestedFlowBlockInteractionIdStack.pop()
            : null);
        const deepestStackKeyForIntx = lodash_1.last(keyForLastOccurrenceOfInteraction);
        const keyToTruncateFrom = HierarchicalIterStack_1.cloneKeyAndMoveTo(HierarchicalIterStack_1.createStackKey(deepestStackKeyForIntx[HierarchicalIterStack_1.STACK_KEY_ITERATION_NUMBER], deepestStackKeyForIntx[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX] - 1), keyForLastOccurrenceOfInteraction, backtracking.interactionStack);
        HierarchicalIterStack_1.deepTruncateIterationsFrom(keyToTruncateFrom, backtracking.interactionStack);
        backtracking.cursor = keyToTruncateFrom;
        return this.navigator.navigateTo(IContext_1.findBlockOnActiveFlowWith(interaction.blockId, this.context), this.context);
    }
    peek(steps = 1) {
        let _steps = steps;
        const intx = lodash_1.findLast(this.context.interactions, ({ type }) => !lodash_1.includes(FlowRunner_1.NON_INTERACTIVE_BLOCK_TYPES, type) && --_steps === 0);
        if (intx == null || _steps > 0) {
            throw new ValidationException_1.default(`Unable to backtrack to an interaction that far back ${JSON.stringify({ steps })}`);
        }
        const block = __1.findBlockWith(intx.blockId, IContext_1.findFlowWith(intx.flowId, this.context));
        const prompt = this.promptBuilder.buildPromptFor(block, intx);
        if (prompt == null) {
            throw new ValidationException_1.default(`Unable to build a prompt for ${JSON.stringify({
                context: this.context.id,
                intx,
                block
            })}`);
        }
        return Object.assign(prompt, { value: intx.value });
    }
    findIndexOfSuggestionFor({ blockId }, key, stack) {
        const keyForSuggestion = HierarchicalIterStack_1.deepIndexOfFrom(key, stack, intx => intx.blockId === blockId);
        if (keyForSuggestion != null) {
            return keyForSuggestion;
        }
        const lastIndexOfIteration = HierarchicalIterStack_1.getIterationFor(key, stack).length - 1;
        const shouldCheckNextIteration = lodash_1.last(key)[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX] === lastIndexOfIteration;
        if (!shouldCheckNextIteration) {
            return;
        }
        const keyForNextIteration = HierarchicalIterStack_1.moveStackIndexTo(HierarchicalIterStack_1.createStackKey(0, 0), lodash_1.cloneDeep(key));
        return HierarchicalIterStack_1.deepIndexOfFrom(keyForNextIteration, stack, intx => intx.blockId === blockId);
    }
    postInteractionCreate(interaction, _context) {
        const { backtracking: { cursor: key, interactionStack, ghostInteractionStacks } } = this.context.platformMetadata;
        if (ghostInteractionStacks.length === 0) {
            return interaction;
        }
        if (!this.hasIndex()) {
            this.rebuildIndex();
        }
        const keyForSuggestion = this.findIndexOfSuggestionFor(interaction, key, interactionStack);
        if (keyForSuggestion == null) {
            return interaction;
        }
        interaction.value = HierarchicalIterStack_1.getEntityAt(keyForSuggestion, interactionStack).value;
        if (keyForSuggestion.join() !== key.join()) {
            ghostInteractionStacks.forEach(ghostInteractionStack => this.syncGhostTo(key, keyForSuggestion, ghostInteractionStack));
        }
        return interaction;
    }
    syncGhostTo(key, keyForSuggestion, ghost) {
        if (keyForSuggestion.length < key.length) {
            throw new ValidationException_1.default(`Unable to sync up ghost; ${JSON.stringify({ key, keyForSuggestion })}`);
        }
        if (keyForSuggestion.length === key.length && keyForSuggestion.toString() === key.toString()) {
            return;
        }
        let isAtGreaterDepth = keyForSuggestion.length > key.length;
        let stackKeyForSuggestion = lodash_1.last(keyForSuggestion);
        const iterationForSuggestion = HierarchicalIterStack_1.getIterationFor(keyForSuggestion, ghost);
        const remainderOfCurrentGhostIteration = iterationForSuggestion.splice(stackKeyForSuggestion[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX], Number.MAX_VALUE);
        let wasEmptyStackLeftOver = false;
        if (isAtGreaterDepth) {
            const { stack } = HierarchicalIterStack_1.getStackFor(keyForSuggestion, ghost);
            stack.splice(0, stackKeyForSuggestion[HierarchicalIterStack_1.STACK_KEY_ITERATION_NUMBER] + 1);
            wasEmptyStackLeftOver = stack.length === 0;
            keyForSuggestion.pop();
        }
        stackKeyForSuggestion = lodash_1.last(keyForSuggestion);
        const deepestStackKeyIndex = keyForSuggestion.length === key.length
            ? lodash_1.last(key)[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX]
            : stackKeyForSuggestion[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX];
        isAtGreaterDepth = keyForSuggestion.length > key.length;
        const itemsBetweenKeyAndGhost = isAtGreaterDepth
            ? 0
            : (stackKeyForSuggestion[HierarchicalIterStack_1.STACK_KEY_ITERATION_INDEX] - deepestStackKeyIndex);
        const containingIterationForSuggestion = HierarchicalIterStack_1.getIterationFor(keyForSuggestion, ghost);
        containingIterationForSuggestion.splice(deepestStackKeyIndex, itemsBetweenKeyAndGhost + (wasEmptyStackLeftOver ? 1 : 0), ...remainderOfCurrentGhostIteration);
        if (isAtGreaterDepth) {
            this.syncGhostTo(key, keyForSuggestion, ghost);
        }
    }
    postInteractionComplete(interaction, _context) {
        const { backtracking: { cursor: key, interactionStack, ghostInteractionStacks } } = this.context.platformMetadata;
        this.insertInteractionUsing(key, interaction, interactionStack);
        if (ghostInteractionStacks.length === 0) {
            return;
        }
        ghostInteractionStacks.forEach(ghostInteractionStack => {
            const ghostIntx = HierarchicalIterStack_1.forceGet(key, ghostInteractionStack);
            if (!HierarchicalIterStack_1.isEntity(ghostIntx)
                || lodash_1.isEqual(interaction.value, ghostIntx.value)) {
                return;
            }
            HierarchicalIterStack_1.truncateIterationFrom(key, ghostInteractionStack);
        });
    }
}
exports.default = BacktrackingBehaviour;
//# sourceMappingURL=BacktrackingBehaviour.js.map