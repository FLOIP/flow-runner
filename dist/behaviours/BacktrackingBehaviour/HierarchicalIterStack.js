"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepIndexOfFrom = exports.deepFindFrom = exports.shallowIndexOfRightFrom = exports.findHeadRightFrom = exports.createStackKeyForLastIterAndLastIndexOf = exports.moveStackIndexTo = exports.cloneKeyAndMoveTo = exports.truncateIterationFrom = exports.deepTruncateIterationsFrom = exports._loop = exports._stepIn = exports._append = exports._replaceAt = exports._insertAt = exports.getStackFor = exports.getIterationFor = exports.isStackEmpty = exports.getEntityAt = exports.forceGet = exports.isIteration = exports.isStack = exports.isEntity = exports.isEntityAt = exports.createStackKey = exports.createKey = exports._findHeadOn = exports.createStackFrom = exports.createStack = exports.STACK_KEY_ITERATION_INDEX = exports.STACK_KEY_ITERATION_NUMBER = void 0;
const lodash_1 = require("lodash");
const index_1 = require("../../index");
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
    const first = stack.stack[0][0];
    return isEntity(first) ? first : _findHeadOn(first);
}
exports._findHeadOn = _findHeadOn;
function createKey(index = -1, iteration = 0) {
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
    return lodash_1.isArray(subject) && !isEntity(subject) && !isStack(subject);
}
exports.isIteration = isIteration;
function forceGet(key, stack) {
    return lodash_1.get(stack, key.join().replace(DEFAULT_JOIN_SEPARATOR_MATCHER, '.'));
}
exports.forceGet = forceGet;
function getEntityAt(key, stack) {
    const entity = forceGet(key, stack);
    if (entity == null || !isEntity(entity)) {
        throw new index_1.ValidationException(`Unable to find entity at ${key}`);
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
    const iterationNumber = lodash_1.last(key)[exports.STACK_KEY_ITERATION_NUMBER];
    const iteration = containingStack.stack[iterationNumber];
    if (!isIteration(iteration)) {
        throw new index_1.ValidationException(`Unable to find iteration one up from ${key}`);
    }
    return iteration;
}
exports.getIterationFor = getIterationFor;
function getStackFor(key, stack) {
    if (key.length === 0) {
        throw new index_1.ValidationException(`An empty key doesn't have a containing stack -- ${key}`);
    }
    if (key.length === 1) {
        return stack;
    }
    const containingStack = forceGet(key.slice(0, -1), stack);
    if (!isStack(containingStack)) {
        throw new index_1.ValidationException(`Unable to find stack one up from ${key}`);
    }
    return containingStack;
}
exports.getStackFor = getStackFor;
function _insertAt(i, entity, iter) {
    return iter.splice(i, 0, entity);
}
exports._insertAt = _insertAt;
function _replaceAt(i, entity, iter) {
    return iter.splice(i, 1, entity);
}
exports._replaceAt = _replaceAt;
function _append(item, stack) {
    const length = lodash_1.last(stack.stack).push(item);
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
function deepTruncateIterationsFrom(key, stack) {
    truncateIterationFrom(key, stack);
    getStackFor(key, stack).stack.splice(lodash_1.last(key)[exports.STACK_KEY_ITERATION_NUMBER] + 1, Number.MAX_VALUE);
    if (key.length <= 1) {
        return;
    }
    deepTruncateIterationsFrom(key.slice(0, -1), stack);
}
exports.deepTruncateIterationsFrom = deepTruncateIterationsFrom;
function truncateIterationFrom(key, stack) {
    if (key.length === 0) {
        return [];
    }
    return getIterationFor(key, stack).splice(lodash_1.last(key)[exports.STACK_KEY_ITERATION_INDEX] + 1, Number.MAX_VALUE);
}
exports.truncateIterationFrom = truncateIterationFrom;
function cloneKeyAndMoveTo(stackKey, key, stack) {
    const duplicateKey = lodash_1.cloneDeep(key);
    const duplicateKeyAtNewPosition = [...duplicateKey.slice(0, -1), stackKey];
    const x = forceGet(duplicateKeyAtNewPosition, stack);
    if (x == null) {
        throw new index_1.ValidationException(`Unable to find item at ${key}`);
    }
    return duplicateKeyAtNewPosition;
}
exports.cloneKeyAndMoveTo = cloneKeyAndMoveTo;
function moveStackIndexTo(dest, key) {
    key.splice(key.length - 1, 1, dest);
    return key;
}
exports.moveStackIndexTo = moveStackIndexTo;
function createStackKeyForLastIterAndLastIndexOf({ stack }) {
    return createStackKey(Math.max(stack.length - 1, 0), Math.max(lodash_1.last(stack).length - 1, 0));
}
exports.createStackKeyForLastIterAndLastIndexOf = createStackKeyForLastIterAndLastIndexOf;
function findHeadRightFrom(key, stack, matcher) {
    const containingStack = getStackFor(key, stack);
    if (!isStackEmpty(containingStack) && matcher(containingStack.head)) {
        return cloneKeyAndMoveTo(createStackKey(0, 0), key, stack);
    }
    return isStackEmpty(containingStack) || containingStack === stack ? undefined : findHeadRightFrom(key.slice(0, -1), stack, matcher);
}
exports.findHeadRightFrom = findHeadRightFrom;
function shallowIndexOfRightFrom(key, stack, matcher) {
    const subject = forceGet(key, stack);
    if (isEntity(subject) && matcher(subject)) {
        return key;
    }
    const deepestStackKey = lodash_1.last(key);
    const i = deepestStackKey[exports.STACK_KEY_ITERATION_INDEX];
    if (i <= 0) {
        return;
    }
    const deepestStackKeyShiftedLeft = ['stack', deepestStackKey[exports.STACK_KEY_ITERATION_NUMBER], i - 1];
    return shallowIndexOfRightFrom([...key.slice(0, -1), deepestStackKeyShiftedLeft], stack, matcher);
}
exports.shallowIndexOfRightFrom = shallowIndexOfRightFrom;
function deepFindFrom(key, stack, matcher, originalKey = key) {
    const keyForMatch = deepIndexOfFrom(key, stack, matcher, originalKey);
    if (keyForMatch == null) {
        return;
    }
    return getEntityAt(keyForMatch, stack);
}
exports.deepFindFrom = deepFindFrom;
function deepIndexOfFrom(key, stack, matcher, originalKey = key) {
    const duplicateKey = lodash_1.cloneDeep(key);
    let { [exports.STACK_KEY_ITERATION_INDEX]: nextIndex, [exports.STACK_KEY_ITERATION_NUMBER]: nextIter } = lodash_1.last(duplicateKey);
    const isNextIndexOutOfBounds = stack.stack[nextIter].length <= ++nextIndex;
    const isOutOfBounds = key.join() === originalKey.join() ? isNextIndexOutOfBounds : isNextIndexOutOfBounds && stack.stack.length <= ++nextIter;
    if (isOutOfBounds) {
        return;
    }
    if (isNextIndexOutOfBounds) {
        nextIndex = 0;
    }
    const keyForNextItem = moveStackIndexTo(createStackKey(nextIter, nextIndex), duplicateKey);
    const item = forceGet(keyForNextItem, stack);
    if (isEntity(item) && matcher(item)) {
        return keyForNextItem;
    }
    if (!isStack(item)) {
        return deepIndexOfFrom(keyForNextItem, stack, matcher, key);
    }
    return deepIndexOfFrom(duplicateKey.concat(createStackKey(0, 0)), stack, matcher, key);
}
exports.deepIndexOfFrom = deepIndexOfFrom;
//# sourceMappingURL=HierarchicalIterStack.js.map