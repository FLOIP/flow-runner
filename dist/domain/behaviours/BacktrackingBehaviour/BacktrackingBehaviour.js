"use strict";
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
        const meta = this.context.vendor_metadata;
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
        const meta = this.context.vendor_metadata;
        return meta.backtracking.interactionStack != null && meta.backtracking.cursor != null;
    }
    rebuildIndex() {
        const { backtracking } = this.context.vendor_metadata;
        const key = (backtracking.cursor = __1.createKey());
        const stack = (backtracking.interactionStack = __1.createStack());
        this.context.interactions.forEach(intx => this.insertInteractionUsing(key, intx, stack));
    }
    insertInteractionUsing(key, interaction, interactionStack) {
        // check: are we repeating anything?
        const keyForIntxOfRepeatedBlock = __1.shallowIndexOfRightFrom(key, interactionStack, intx => intx.block_id === interaction.block_id);
        if (keyForIntxOfRepeatedBlock != null) {
            // [Step In] Found a new stack to step into
            this._stepIn(key, interactionStack, keyForIntxOfRepeatedBlock, interaction);
            return;
        }
        // check if any parent stacks start with a matching block; included current stack, but that should be caught above
        const keyToBeginningOfStackWithHeadMatchingBlock = __1.findHeadRightFrom(key, interactionStack, intx => intx.block_id === interaction.block_id);
        if (keyToBeginningOfStackWithHeadMatchingBlock != null) {
            // [Step Out] Found an stack to continue on from
            this._stepOut(keyToBeginningOfStackWithHeadMatchingBlock, interactionStack, interaction, key);
            return;
        }
        // push onto current stack + update key with new size - 1
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
        // todo: abstract key operations
        const i = lodash_1.last(keyForIntxOfRepeatedBlock)[__1.STACK_KEY_ITERATION_INDEX];
        // take from i to the end
        const nestedIteration = iteration.splice(i);
        // append taken items (returned); append [intx]
        const nestedStack = __1.createStack(nestedIteration);
        // append onto parent <-- todo: update head! // todo: let's use _append() here
        iteration.push(nestedStack);
        __1._loop(nestedStack, [interaction]);
        // update key like: replace current key w/ found index; append [1 (new stack), 1 (second iteration)]
        lodash_1.last(key)[__1.STACK_KEY_ITERATION_INDEX] = i;
        key.push(__1.createStackKey(1, 0));
    }
    jumpTo(interaction, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { backtracking } = this.context.vendor_metadata;
            // find a key for provided past interaction
            const keyForLastOccurrenceOfInteraction = __1.deepIndexOfFrom(__1.createKey(), // begins search from beginning -- todo: search from right?
            backtracking.interactionStack, ({ uuid }) => uuid === interaction.uuid);
            if (keyForLastOccurrenceOfInteraction == null) {
                throw new __1.ValidationException('Unable to find destination interaction in backtracking stack for jumpTo()');
            }
            // todo: if something hasn't changed, can we extend this ghost rather than creating anew?
            // create ghost stack to follow after jumping back
            backtracking.ghostInteractionStacks.push(lodash_1.cloneDeep(backtracking.interactionStack));
            // jump context.interactions back in time
            const discarded = context.interactions.splice(
            // truncate interactions list to pull us back in time; including provided intx
            lodash_1.findLastIndex(context.interactions, interaction), context.interactions.length);
            // step out of nested flows that we've truncated
            lodash_1.forEachRight(discarded, intx => intx.uuid === lodash_1.last(context.nested_flow_block_interaction_id_stack) ? context.nested_flow_block_interaction_id_stack.pop() : null);
            // update interactionStack to match
            // todo: should this truncate be inclusive or exclusive?
            //       - it should remove found interaction; aka point should result in none; how does this change references to backtracking.cursor thenceforth?
            const deepestStackKeyForIntx = lodash_1.last(keyForLastOccurrenceOfInteraction);
            const keyToTruncateFrom = __1.cloneKeyAndMoveTo(__1.createStackKey(deepestStackKeyForIntx[__1.STACK_KEY_ITERATION_NUMBER], deepestStackKeyForIntx[__1.STACK_KEY_ITERATION_INDEX] - 1), // slide left one so that we free current spot up
            keyForLastOccurrenceOfInteraction, backtracking.interactionStack);
            __1.deepTruncateIterationsFrom(keyToTruncateFrom, backtracking.interactionStack);
            // set backtracking cursor to match
            backtracking.cursor = keyToTruncateFrom; // keyForLastOccurrenceOfInteraction // todo: this now points at a null; should it be `keyToTruncateFrom`?
            // todo: This navigateTo() is going to append an interaction onto context.interactions --> verify that context.interactions.splice() accounts for that
            // todo: this should provide a sourceId="" in meta so that we can tie these together
            return this.navigator.navigateTo(__1.findBlockOnActiveFlowWith(interaction.block_id, this.context), this.context);
        });
    }
    peek(steps = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let _steps = steps;
            const intx = lodash_1.findLast(this.context.interactions, ({ type }) => !lodash_1.includes(__1.NON_INTERACTIVE_BLOCK_TYPES, type) && --_steps === 0);
            if (intx == null || _steps > 0) {
                throw new __1.ValidationException(`Unable to backtrack to an interaction that far back ${JSON.stringify({ steps })}`);
            }
            const block = __1.findBlockWith(intx.block_id, __1.findFlowWith(intx.flow_id, this.context));
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
    findIndexOfSuggestionFor({ block_id }, key, stack) {
        const keyForSuggestion = __1.deepIndexOfFrom(key, stack, intx => intx.block_id === block_id);
        if (keyForSuggestion != null) {
            return keyForSuggestion;
        }
        // also scan next iteration when we're on last index of current iteration
        const lastIndexOfIteration = __1.getIterationFor(key, stack).length - 1;
        const shouldCheckNextIteration = lodash_1.last(key)[__1.STACK_KEY_ITERATION_INDEX] === lastIndexOfIteration;
        if (!shouldCheckNextIteration) {
            return;
        }
        const keyForNextIteration = __1.moveStackIndexTo(__1.createStackKey(0, 0), lodash_1.cloneDeep(key)); // todo: use cloneKeyAndMoveTo()
        return __1.deepIndexOfFrom(keyForNextIteration, stack, intx => intx.block_id === block_id);
    }
    postInteractionCreate(interaction, _context) {
        const { backtracking: { cursor: key, 
        // interactionStack,
        ghostInteractionStacks, }, } = this.context.vendor_metadata;
        if (ghostInteractionStacks.length === 0) {
            // can't suggest when we don't have ghost interactions from the past
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
        // todo: this should be looking at ghostInteractionStacks and not interactionStack ???
        interaction.value = __1.getEntityAt(keyForSuggestion, lastGhost).value;
        // need to splice out things between key + keyForSuggestion so that key points to both interaction and suggestion
        if (keyForSuggestion.join() !== key.join()) {
            ghostInteractionStacks.forEach((ghostInteractionStack // todo: fix up syncGhost now that we're multi-tracking
            ) => this.syncGhostTo(key, keyForSuggestion, ghostInteractionStack)); // todo: reverse these keys to match signature?!
        }
        return interaction;
    }
    /**
     * A hierarchical deep splice to remove items between two keys, hoisting deepest iteration to main depth.
     * ghost=[[0, 1], [1, 3], [0, 1], [1, 2]]
     * main=[[0, 1], [1, 4]] */
    syncGhostTo(key, keyForSuggestion, ghost) {
        // : Key {
        // todo: refactor this into stack::deepSplice(): Item[]
        //       if we provide items (remainderOfCurrentGhostIteration), this becomes two logical pieces splice() + deepSplice()
        if (keyForSuggestion.length < key.length) {
            throw new __1.ValidationException(`Unable to sync up ghost; ${JSON.stringify({ key, keyForSuggestion })}`);
        }
        if (keyForSuggestion.length === key.length && keyForSuggestion.toString() === key.toString()) {
            return; // keyForSuggestion
        }
        let isAtGreaterDepth = keyForSuggestion.length > key.length;
        let stackKeyForSuggestion = lodash_1.last(keyForSuggestion);
        // find our keepers = remainderOfCurrentGhostIteration
        const iterationForSuggestion = __1.getIterationFor(keyForSuggestion, ghost);
        const remainderOfCurrentGhostIteration = iterationForSuggestion.splice(stackKeyForSuggestion[__1.STACK_KEY_ITERATION_INDEX], Number.MAX_VALUE);
        // discard iterations up to + including one with keepers
        let wasEmptyStackLeftOver = false;
        if (isAtGreaterDepth) {
            const { stack } = __1.getStackFor(keyForSuggestion, ghost);
            stack.splice(0, stackKeyForSuggestion[__1.STACK_KEY_ITERATION_NUMBER] + 1);
            wasEmptyStackLeftOver = stack.length === 0;
            keyForSuggestion.pop(); // update suggestion key to point to containing stack
        }
        // splice keepers onto containing stack at suggestedKeyIterAndIndex; discarding # of items between
        stackKeyForSuggestion = lodash_1.last(keyForSuggestion);
        const deepestStackKeyIndex = keyForSuggestion.length === key.length ? lodash_1.last(key)[__1.STACK_KEY_ITERATION_INDEX] : stackKeyForSuggestion[__1.STACK_KEY_ITERATION_INDEX];
        isAtGreaterDepth = keyForSuggestion.length > key.length;
        const itemsBetweenKeyAndGhost = isAtGreaterDepth
            ? 0 // when still different depth after .pop()
            : stackKeyForSuggestion[__1.STACK_KEY_ITERATION_INDEX] - deepestStackKeyIndex; // {sugKey's index} - {key's index} when same depth
        const containingIterationForSuggestion = __1.getIterationFor(keyForSuggestion, ghost);
        containingIterationForSuggestion.splice(deepestStackKeyIndex, itemsBetweenKeyAndGhost + (wasEmptyStackLeftOver ? 1 : 0), ...remainderOfCurrentGhostIteration);
        // when still at greater depth: repeat the ordeal
        if (isAtGreaterDepth) {
            this.syncGhostTo(key, keyForSuggestion, ghost);
        }
    }
    postInteractionComplete(interaction, _context) {
        const { backtracking: { cursor: key, interactionStack, ghostInteractionStacks }, } = this.context.vendor_metadata;
        this.insertInteractionUsing(key, interaction, interactionStack);
        if (ghostInteractionStacks.length === 0) {
            // can't suggest when we don't have ghost interactions from the past
            return;
        }
        ghostInteractionStacks.forEach(ghostInteractionStack => {
            // update ghost to account for changes while stepping forward
            const ghostIntx = __1.forceGet(key, ghostInteractionStack); // todo: this should actually be a deepFindFrom() w/in current iteration
            // when ghost is absent or ghost value matches
            if (!__1.isEntity(ghostIntx) || lodash_1.isEqual(interaction.value, ghostIntx.value)) {
                return; // do nothing
            }
            // when interaction's value differs from interaction@ghost's value
            // remove the possibility of suggesting from future -- todo: verify this logic -- can we be this destructive?
            // assumption: keys point to same points in both ghost and main stacks
            __1.truncateIterationFrom(key, ghostInteractionStack); // todo: should this be inclusive or exclusive?
        });
    }
}
exports.BacktrackingBehaviour = BacktrackingBehaviour;
//# sourceMappingURL=BacktrackingBehaviour.js.map