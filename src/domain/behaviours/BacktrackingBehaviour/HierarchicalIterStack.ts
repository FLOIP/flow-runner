import {
  cloneDeep,
  get as lodashGet,
  isArray,
  last as lodashLast,
} from 'lodash'

import ValidationException from '../../exceptions/ValidationException'

export type IterationIndex = number
export type IterationNumber = number
export type StackKey = ['stack', IterationNumber, IterationIndex] // string of 'stack' correlates to IStack['stack'] prop
export type Key = StackKey[] //(IterationIndex | StackKey)[] // todo: are we only using a list of StackKey now? Eg. always in a stack
export interface IEntity {uuid: string}
export type Iteration = (IEntity | IStack)[]

export interface IStack {  // todo: rename this so it's not `stack.stack` <-- rename stack.stack to stack.iterations
  stack: Iteration[] // todo: rename to _stack, "private" becuase most manipulations should happen via behaviour provided
  head?: IEntity // todo: ensure head is updated when manipulating an iteration
}

export type Item = IEntity | Iteration | IStack
export type IEntityMatcher = (x: IEntity) => boolean

export const STACK_KEY_ITERATION_NUMBER = 1
export const STACK_KEY_ITERATION_INDEX = 2

const DEFAULT_JOIN_SEPARATOR_MATCHER = /,/g


export function createStack(firstIteration: Iteration = []): IStack {
  return createStackFrom([firstIteration])
}

export function createStackFrom(iterations: Iteration[]): IStack {
  const stack: IStack = {stack: iterations}
  stack.head = _findHeadOn(stack)
  return stack
}

export function _findHeadOn(stack: IStack): IEntity | undefined {
  if (isStackEmpty(stack)) {
    return
  }

  const first = stack.stack[0][0] // [1st-iteration][1st-element]
  return isEntity(first)
    ? first
    : _findHeadOn(first)
}

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
export function createKey(index: number = -1, iteration: number = 0): Key {
  return [createStackKey(iteration, index)] // `-1` so that the typing needn't allow nulls, it's a non-existent value.
}

export function createStackKey(iteration: number, index: number): StackKey {
  return ['stack', iteration, index]
}

export function isEntityAt(key: Key, stack: IStack): boolean {
  return isEntity(forceGet(key, stack))
}

export function isEntity(subject: Item): subject is IEntity {
  return subject != null && 'uuid' in subject
}

export function isStack(subject: Item): subject is IStack {
  return subject != null && 'stack' in subject
}

export function isIteration(subject: Item): subject is Iteration {
  return isArray(subject)
    && !isEntity(subject)
    && !isStack(subject)
}

export function forceGet(key: Key, stack: IStack): Item {
  return lodashGet(stack, key.join()
    .replace(DEFAULT_JOIN_SEPARATOR_MATCHER, '.')) // stacks are nested, so we just make a 2nd pass to cover all commas at once
}

export function getEntityAt(key: Key, stack: IStack): IEntity {
  const entity = forceGet(key, stack)
  if (entity == null || !isEntity(entity)) {
    throw new ValidationException(`Unable to find entity at ${key}`)
  }

  return entity
}

export function isStackEmpty({stack}: IStack): boolean {
  return stack.length === 0
    || stack[0].length === 0
}

export function getIterationFor(key: Key, stack: IStack): Iteration {
  const containingStack = getStackFor(key ,stack)
  const iterationNumber = lodashLast(key)![STACK_KEY_ITERATION_NUMBER]
  const iteration = containingStack.stack[iterationNumber]

  if (!isIteration(iteration)) {
    throw new ValidationException(`Unable to find iteration one up from ${key}`)
  }

  return iteration
}

export function getStackFor(key: Key, stack: IStack): IStack {
  if (key.length === 0) {
    throw new ValidationException(`An empty key doesn't have a containing stack -- ${key}`)
  }

  if (key.length === 1) {
    return stack
  }

  const containingStack = forceGet(key.slice(0, -1), stack)
  if (!isStack(containingStack)) {
    throw new ValidationException(`Unable to find stack one up from ${key}`)
  }

  return containingStack
}

export function _insertAt(i: number, entity: IEntity, iter: Iteration) {
  // todo: update head + tail
  return iter.splice(i, 0, entity)
}

export function _replaceAt(i: number, entity: IEntity, iter: Iteration): Item {
  // todo: update head + tail
  return iter.splice(i, 1, entity)
}

export function _append(item: IEntity | IStack, stack: IStack): number {
  const length = lodashLast(stack.stack)!.push(item)
  if (stack.stack.length === 1 && length === 1) {
    stack.head = _findHeadOn(stack)
  }

  return length
}

export function _stepIn(stack: IStack, firstIteration: Iteration = []) {
  return _append(createStack(firstIteration), stack)
}

export function _loop(stack: IStack, nextIteration: Iteration = []) {
  stack.stack.push(nextIteration)
  return stack
}

/**
 * Remove tail end of current iteration _after_ cursor and up hierarchy as well. */
export function deepTruncateIterationsFrom(key: Key, stack: IStack) {
  truncateIterationFrom(key, stack)
  getStackFor(key, stack)
    .stack
    .splice(lodashLast(key)![STACK_KEY_ITERATION_NUMBER] + 1, Number.MAX_VALUE)

  if (key.length <= 1) {
    return
  }

  // get containing stack + repeat
  deepTruncateIterationsFrom(key.slice(0, -1), stack)
}

/**
 * Remove tail end of current iteration _after_ provided cursor. */
export function truncateIterationFrom(key: Key, stack: IStack): Iteration {
  if (key.length === 0) {
    return []
  }

  // get iter + splice from that index
  return getIterationFor(key, stack)
    .splice(lodashLast(key)![STACK_KEY_ITERATION_INDEX] + 1, Number.MAX_VALUE)
}

export function cloneKeyAndMoveTo(stackKey: StackKey, key: Key, stack: IStack): Key {
  const duplicateKey = cloneDeep(key)

  const duplicateKeyAtNewPosition = [...duplicateKey.slice(0, -1), stackKey]
  const x: Item = forceGet(duplicateKeyAtNewPosition, stack) // todo: how is forceGet() typed as Item -- this could be `undefined`
  if (x == null) {
    throw new ValidationException(`Unable to find item at ${key}`)
  }

  return duplicateKeyAtNewPosition
}

/**
 * Replace last stack key with {dest}, while retaining key reference. */
export function moveStackIndexTo(dest: StackKey, key: Key): Key {
  key.splice(key.length - 1, 1, dest)
  return key
}

export function createStackKeyForLastIterAndLastIndexOf({stack}: IStack): StackKey {
  return createStackKey(
    Math.max(stack.length - 1, 0),
    Math.max(lodashLast(stack)!.length - 1, 0))
}

/**
 * Used for stepping out; searching heads from inner to outer to see if we're pulling head of a different iteration.
 * @return key - when found: a key pointing to an IStack (rather than a leaf node as per all other instances.
 *                           However, pls pay special attention that a key pointing to a stack is going to be one up,
 *                           and for the case of the root stack, this will be an empty key like: [].
 *                otherwise: undefined
 */

// what do we want to receive from findHeadRight? Options:
// - empty list: implying we're at root
//
// ideal:
// - get the stack at {key}, append to the stack a new iteration with the interaction on it
//
// hurdles:
// - index of stack at root is nil, because it's the container
//
// wait…
// - if we return a key pointing to the iteration that we found a match for, this may be the most obvious
// - I don't think we want to need to need a forceGet from external api method -- right?
// - let's say for a root head the is a match, we return a key to the root head -- is this easy?
// - the tricky part here is that we're inherently creating the possibility that it could be a pointer to either
//   an interaction or a stack -- stack may be surprising, but it's because we are matching on a particular UUID
//   but this could be due to nested iterations?
// todo: prove it! what exactly is our domain logic where we'd nested at [0,0] ? I don't think it's possible,
//       because right now we're going to append an iteration to containing stack when this happens
//       as a method of stepping out

export function findHeadRightFrom(key: Key, stack: IStack, matcher: IEntityMatcher): Key | undefined {
  let containingStack = getStackFor(key, stack)

  if (!isStackEmpty(containingStack) && matcher(containingStack.head!)) {
    // create a key to [iter:0][i:0] of current stack
    return cloneKeyAndMoveTo(createStackKey(0, 0), key, stack)
  }

  // containingStack is stack when we're at root
  return isStackEmpty(containingStack) || containingStack === stack
    ? undefined
    : findHeadRightFrom(key.slice(0, -1), stack, matcher)
}

/**
 * Used for stepping in; searching right-to-left for a particular entity for repetition.
 * We only care about top-level Entities. */
export function shallowIndexOfRightFrom(key: Key, stack: IStack, matcher: IEntityMatcher): Key | undefined {
  // todo: what should happen when we get to 0 and 0 is a stack?

  const subject = forceGet(key, stack)

  if (isEntity(subject) && matcher(subject)) {
    return key
  }

  const deepestStackKey: StackKey = lodashLast(key) as StackKey
  const i: number = deepestStackKey[STACK_KEY_ITERATION_INDEX]
  if (i <= 0) {
    return
  }

  const deepestStackKeyShiftedLeft: StackKey = ['stack', deepestStackKey[STACK_KEY_ITERATION_NUMBER], i - 1]
  return shallowIndexOfRightFrom([...key.slice(0, -1), deepestStackKeyShiftedLeft], stack, matcher) as Key
}

/**
 * Recursive left search of hierarchy from a particular point; excludes current pointer's entity. */
export function deepFindFrom(key: Key, stack: IStack, matcher: IEntityMatcher, originalKey: Key = key): IEntity | undefined {
  const keyForMatch: Key | undefined = deepIndexOfFrom(key, stack, matcher, originalKey)
  if (keyForMatch == null) {
    return
  }

  return getEntityAt(keyForMatch, stack)
}

export function deepIndexOfFrom(key: Key, stack: IStack, matcher: IEntityMatcher, originalKey: Key = key): Key | undefined {
  const duplicateKey = cloneDeep(key)
  let {
    [STACK_KEY_ITERATION_INDEX]: nextIndex,
    [STACK_KEY_ITERATION_NUMBER]: nextIter,
  } = lodashLast(duplicateKey)!

  const isNextIndexOutOfBounds = stack.stack[nextIter].length <= ++nextIndex
  const isOutOfBounds = key.join() === originalKey.join() // we're at original depth; don't step outside this iteration
    ? isNextIndexOutOfBounds
    : isNextIndexOutOfBounds && stack.stack.length <= ++nextIter

  if (isOutOfBounds) {
    return // get out, we didn't find it
  }

  if (isNextIndexOutOfBounds) {
    nextIndex = 0 // iteration was incremented; we're checking a nested stack
  }

  const keyForNextItem = moveStackIndexTo(createStackKey(nextIter, nextIndex), duplicateKey)
  const item = forceGet(keyForNextItem, stack)
  if (isEntity(item) && matcher(item)) {
    return keyForNextItem
  }

  if (!isStack(item)) {
    // we need an actual indexOf here -- basically scan left for an entire iteration
    return deepIndexOfFrom(keyForNextItem, stack, matcher, key)
  }

  // nest one level deeper at current key
  return deepIndexOfFrom(duplicateKey.concat(createStackKey(0, 0)), stack, matcher, key)
}
