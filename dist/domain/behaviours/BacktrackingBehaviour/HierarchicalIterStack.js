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
exports.deepIndexOfFrom = exports.deepFindFrom = exports.shallowIndexOfRightFrom = exports.findHeadRightFrom = exports.createStackKeyForLastIterAndLastIndexOf = exports.moveStackIndexTo = exports.cloneKeyAndMoveTo = exports.truncateIterationFrom = exports.deepTruncateIterationsFrom = exports._loop = exports._stepIn = exports._append = exports._replaceAt = exports._insertAt = exports.getStackFor = exports.getIterationFor = exports.isStackEmpty = exports.getEntityAt = exports.forceGet = exports.isIteration = exports.isStack = exports.isEntity = exports.isEntityAt = exports.createStackKey = exports.createKey = exports._findHeadOn = exports.createStackFrom = exports.createStack = exports.STACK_KEY_ITERATION_INDEX = exports.STACK_KEY_ITERATION_NUMBER = void 0;
const lodash_1 = require("lodash");
const __1 = require("../../..");
exports.STACK_KEY_ITERATION_NUMBER = 1;
exports.STACK_KEY_ITERATION_INDEX = 2;
const DEFAULT_JOIN_SEPARATOR_MATCHER = /,/g;
function createStack(firstIteration = []) {
    return createStackFrom([firstIteration]);
}
exports.createStack = createStack;
function createStackFrom(iterations) {
    const stack = { stack: iterations };
    stack.head = _findHeadOn(stack);
    return stack;
}
exports.createStackFrom = createStackFrom;
function _findHeadOn(stack) {
    if (isStackEmpty(stack)) {
        return;
    }
    // [1st-iteration][1st-element]
    const first = stack.stack[0][0];
    return isEntity(first) ? first : _findHeadOn(first);
}
exports._findHeadOn = _findHeadOn;
/**
 * These keys are a bit magical: They're a list of indexes, organized hierarchically.
 * Each item in the outermost list represents a layer of nesting.
 * Each number itself is an index into our call stack.
 * We've kept these as a simple list of number|tuples so that we can do a simple join for retrievals.
 * We've used a tuple for stacks so that pop and rollup are similarly trivial.
 *
 * Example using numbers rather than Entities for brevity:
 * {stack: [[ ]]} === [['stack', 0, -1]]
 *           ^
 * {stack: [[1]]} === [['stack', 0, 0]]
 *           ^
 * Here we're nestled into base stack, 0th iteration, 3rd index
 * {stack: [[1, 2, 3, 4]]} --> [['stack', 0, 3]]
 *                    ^
 *
 * Here we're nested by one stack, 1st iteration, 0th index
 * {stack: [[1, 2, {stack: [[3, 4], [3]]}]]} --> [['stack', 0, 3], ['stack', 1, 0]]
 *                                   ^
 */
function createKey(index = -1, iteration = 0) {
    // `-1` so that the typing needn't allow nulls, it's a non-existent value.
    return [createStackKey(iteration, index)];
}
exports.createKey = createKey;
function createStackKey(iteration, index) {
    return ['stack', iteration, index];
}
exports.createStackKey = createStackKey;
function isEntityAt(key, stack) {
    return isEntity(forceGet(key, stack));
}
exports.isEntityAt = isEntityAt;
function isEntity(subject) {
    return subject != null && 'uuid' in subject;
}
exports.isEntity = isEntity;
function isStack(subject) {
    return subject != null && 'stack' in subject;
}
exports.isStack = isStack;
function isIteration(subject) {
    return (0, lodash_1.isArray)(subject) && !isEntity(subject) && !isStack(subject);
}
exports.isIteration = isIteration;
function forceGet(key, stack) {
    // stacks are nested, so we just make a 2nd pass to cover all commas at once
    return (0, lodash_1.get)(stack, key.join().replace(DEFAULT_JOIN_SEPARATOR_MATCHER, '.'));
}
exports.forceGet = forceGet;
function getEntityAt(key, stack) {
    const entity = forceGet(key, stack);
    if (entity == null || !isEntity(entity)) {
        throw new __1.ValidationException(`Unable to find entity at ${key}`);
    }
    return entity;
}
exports.getEntityAt = getEntityAt;
function isStackEmpty({ stack }) {
    return stack.length === 0 || stack[0].length === 0;
}
exports.isStackEmpty = isStackEmpty;
function getIterationFor(key, stack) {
    const containingStack = getStackFor(key, stack);
    const iterationNumber = (0, lodash_1.last)(key)[exports.STACK_KEY_ITERATION_NUMBER];
    const iteration = containingStack.stack[iterationNumber];
    if (!isIteration(iteration)) {
        throw new __1.ValidationException(`Unable to find iteration one up from ${key}`);
    }
    return iteration;
}
exports.getIterationFor = getIterationFor;
function getStackFor(key, stack) {
    if (key.length === 0) {
        throw new __1.ValidationException(`An empty key doesn't have a containing stack -- ${key}`);
    }
    if (key.length === 1) {
        return stack;
    }
    const containingStack = forceGet(key.slice(0, -1), stack);
    if (!isStack(containingStack)) {
        throw new __1.ValidationException(`Unable to find stack one up from ${key}`);
    }
    return containingStack;
}
exports.getStackFor = getStackFor;
function _insertAt(i, entity, iter) {
    // todo: update head + tail
    return iter.splice(i, 0, entity);
}
exports._insertAt = _insertAt;
function _replaceAt(i, entity, iter) {
    // todo: update head + tail
    return iter.splice(i, 1, entity);
}
exports._replaceAt = _replaceAt;
function _append(item, stack) {
    const length = (0, lodash_1.last)(stack.stack).push(item);
    if (stack.stack.length === 1 && length === 1) {
        stack.head = _findHeadOn(stack);
    }
    return length;
}
exports._append = _append;
function _stepIn(stack, firstIteration = []) {
    return _append(createStack(firstIteration), stack);
}
exports._stepIn = _stepIn;
function _loop(stack, nextIteration = []) {
    stack.stack.push(nextIteration);
    return stack;
}
exports._loop = _loop;
/**
 * Remove tail end of current iteration _after_ cursor and up hierarchy as well. */
function deepTruncateIterationsFrom(key, stack) {
    truncateIterationFrom(key, stack);
    getStackFor(key, stack).stack.splice((0, lodash_1.last)(key)[exports.STACK_KEY_ITERATION_NUMBER] + 1, Number.MAX_VALUE);
    if (key.length <= 1) {
        return;
    }
    // get containing stack + repeat
    deepTruncateIterationsFrom(key.slice(0, -1), stack);
}
exports.deepTruncateIterationsFrom = deepTruncateIterationsFrom;
/**
 * Remove tail end of current iteration _after_ provided cursor. */
function truncateIterationFrom(key, stack) {
    if (key.length === 0) {
        return [];
    }
    // get iter + splice from that index
    return getIterationFor(key, stack).splice((0, lodash_1.last)(key)[exports.STACK_KEY_ITERATION_INDEX] + 1, Number.MAX_VALUE);
}
exports.truncateIterationFrom = truncateIterationFrom;
function cloneKeyAndMoveTo(stackKey, key, stack) {
    const duplicateKey = (0, lodash_1.cloneDeep)(key);
    const duplicateKeyAtNewPosition = [...duplicateKey.slice(0, -1), stackKey];
    // todo: how is forceGet() typed as Item -- this could be `undefined`
    const x = forceGet(duplicateKeyAtNewPosition, stack);
    if (x == null) {
        throw new __1.ValidationException(`Unable to find item at ${key}`);
    }
    return duplicateKeyAtNewPosition;
}
exports.cloneKeyAndMoveTo = cloneKeyAndMoveTo;
/**
 * Replace last stack key with {dest}, while retaining key reference. */
function moveStackIndexTo(dest, key) {
    key.splice(key.length - 1, 1, dest);
    return key;
}
exports.moveStackIndexTo = moveStackIndexTo;
function createStackKeyForLastIterAndLastIndexOf({ stack }) {
    return createStackKey(Math.max(stack.length - 1, 0), Math.max((0, lodash_1.last)(stack).length - 1, 0));
}
exports.createStackKeyForLastIterAndLastIndexOf = createStackKeyForLastIterAndLastIndexOf;
/**
 * Used for stepping out; searching heads from inner to outer to see if we're pulling head of a different iteration.
 * @return key - when found: a key pointing to an IStack (rather than a leaf node as per all other instances.
 *                           However, pls pay special attention that a key pointing to a stack is going to be one up,
 *                           and for the case of the root stack, this will be an empty key like: [].
 *                otherwise: undefined
 */
// todo: what exactly is our domain logic where we'd nested at [0,0] ? I don't think it's possible,
//       because right now we're going to append an iteration to containing stack when this happens
//       as a method of stepping out
function findHeadRightFrom(key, stack, matcher) {
    const containingStack = getStackFor(key, stack);
    if (!isStackEmpty(containingStack) && matcher(containingStack.head)) {
        // create a key to [iter:0][i:0] of current stack
        return cloneKeyAndMoveTo(createStackKey(0, 0), key, stack);
    }
    // containingStack is stack when we're at root
    return isStackEmpty(containingStack) || containingStack === stack ? undefined : findHeadRightFrom(key.slice(0, -1), stack, matcher);
}
exports.findHeadRightFrom = findHeadRightFrom;
/**
 * Used for stepping in; searching right-to-left for a particular entity for repetition.
 * We only care about top-level Entities. */
function shallowIndexOfRightFrom(key, stack, matcher) {
    // todo: what should happen when we get to 0 and 0 is a stack?
    const subject = forceGet(key, stack);
    if (isEntity(subject) && matcher(subject)) {
        return key;
    }
    const deepestStackKey = (0, lodash_1.last)(key);
    const i = deepestStackKey[exports.STACK_KEY_ITERATION_INDEX];
    if (i <= 0) {
        return;
    }
    const deepestStackKeyShiftedLeft = ['stack', deepestStackKey[exports.STACK_KEY_ITERATION_NUMBER], i - 1];
    return shallowIndexOfRightFrom([...key.slice(0, -1), deepestStackKeyShiftedLeft], stack, matcher);
}
exports.shallowIndexOfRightFrom = shallowIndexOfRightFrom;
/**
 * Recursive left search of hierarchy from a particular point; excludes current pointer's entity. */
function deepFindFrom(key, stack, matcher, originalKey = key) {
    const keyForMatch = deepIndexOfFrom(key, stack, matcher, originalKey);
    if (keyForMatch == null) {
        return;
    }
    return getEntityAt(keyForMatch, stack);
}
exports.deepFindFrom = deepFindFrom;
function deepIndexOfFrom(key, stack, matcher, originalKey = key) {
    const duplicateKey = (0, lodash_1.cloneDeep)(key);
    let { [exports.STACK_KEY_ITERATION_INDEX]: nextIndex, [exports.STACK_KEY_ITERATION_NUMBER]: nextIter } = (0, lodash_1.last)(duplicateKey);
    const isNextIndexOutOfBounds = stack.stack[nextIter].length <= ++nextIndex;
    // we're at original depth; don't step outside this iteration
    const isOutOfBounds = key.join() === originalKey.join() ? isNextIndexOutOfBounds : isNextIndexOutOfBounds && stack.stack.length <= ++nextIter;
    if (isOutOfBounds) {
        // get out, we didn't find it
        return;
    }
    if (isNextIndexOutOfBounds) {
        // iteration was incremented; we're checking a nested stack
        nextIndex = 0;
    }
    const keyForNextItem = moveStackIndexTo(createStackKey(nextIter, nextIndex), duplicateKey);
    const item = forceGet(keyForNextItem, stack);
    if (isEntity(item) && matcher(item)) {
        return keyForNextItem;
    }
    if (!isStack(item)) {
        // we need an actual indexOf here -- basically scan left for an entire iteration
        return deepIndexOfFrom(keyForNextItem, stack, matcher, key);
    }
    // nest one level deeper at current key
    return deepIndexOfFrom(duplicateKey.concat(createStackKey(0, 0)), stack, matcher, key);
}
exports.deepIndexOfFrom = deepIndexOfFrom;
//# sourceMappingURL=HierarchicalIterStack.js.map