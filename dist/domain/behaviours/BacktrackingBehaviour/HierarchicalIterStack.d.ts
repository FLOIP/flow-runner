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
export type IterationIndex = number;
export type IterationNumber = number;
export type StackKey = ['stack', IterationNumber, IterationIndex];
export type Key = StackKey[];
export interface IEntity {
    uuid: string;
}
export type Iteration = (IEntity | IStack)[];
export interface IStack {
    stack: Iteration[];
    head?: IEntity;
}
export type Item = IEntity | Iteration | IStack;
export type IEntityMatcher = (x: IEntity) => boolean;
export declare const STACK_KEY_ITERATION_NUMBER = 1;
export declare const STACK_KEY_ITERATION_INDEX = 2;
export declare function createStack(firstIteration?: Iteration): IStack;
export declare function createStackFrom(iterations: Iteration[]): IStack;
export declare function _findHeadOn(stack: IStack): IEntity | undefined;
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
export declare function createKey(index?: number, iteration?: number): Key;
export declare function createStackKey(iteration: number, index: number): StackKey;
export declare function isEntityAt(key: Key, stack: IStack): boolean;
export declare function isEntity(subject: Item): subject is IEntity;
export declare function isStack(subject: Item): subject is IStack;
export declare function isIteration(subject: Item): subject is Iteration;
export declare function forceGet(key: Key, stack: IStack): Item;
export declare function getEntityAt(key: Key, stack: IStack): IEntity;
export declare function isStackEmpty({ stack }: IStack): boolean;
export declare function getIterationFor(key: Key, stack: IStack): Iteration;
export declare function getStackFor(key: Key, stack: IStack): IStack;
export declare function _insertAt(i: number, entity: IEntity, iter: Iteration): (IEntity | IStack)[];
export declare function _replaceAt(i: number, entity: IEntity, iter: Iteration): Item;
export declare function _append(item: IEntity | IStack, stack: IStack): number;
export declare function _stepIn(stack: IStack, firstIteration?: Iteration): number;
export declare function _loop(stack: IStack, nextIteration?: Iteration): IStack;
/**
 * Remove tail end of current iteration _after_ cursor and up hierarchy as well. */
export declare function deepTruncateIterationsFrom(key: Key, stack: IStack): void;
/**
 * Remove tail end of current iteration _after_ provided cursor. */
export declare function truncateIterationFrom(key: Key, stack: IStack): Iteration;
export declare function cloneKeyAndMoveTo(stackKey: StackKey, key: Key, stack: IStack): Key;
/**
 * Replace last stack key with {dest}, while retaining key reference. */
export declare function moveStackIndexTo(dest: StackKey, key: Key): Key;
export declare function createStackKeyForLastIterAndLastIndexOf({ stack }: IStack): StackKey;
/**
 * Used for stepping out; searching heads from inner to outer to see if we're pulling head of a different iteration.
 * @return key - when found: a key pointing to an IStack (rather than a leaf node as per all other instances.
 *                           However, pls pay special attention that a key pointing to a stack is going to be one up,
 *                           and for the case of the root stack, this will be an empty key like: [].
 *                otherwise: undefined
 */
export declare function findHeadRightFrom(key: Key, stack: IStack, matcher: IEntityMatcher): Key | undefined;
/**
 * Used for stepping in; searching right-to-left for a particular entity for repetition.
 * We only care about top-level Entities. */
export declare function shallowIndexOfRightFrom(key: Key, stack: IStack, matcher: IEntityMatcher): Key | undefined;
/**
 * Recursive left search of hierarchy from a particular point; excludes current pointer's entity. */
export declare function deepFindFrom(key: Key, stack: IStack, matcher: IEntityMatcher, originalKey?: Key): IEntity | undefined;
export declare function deepIndexOfFrom(key: Key, stack: IStack, matcher: IEntityMatcher, originalKey?: Key): Key | undefined;
//# sourceMappingURL=HierarchicalIterStack.d.ts.map