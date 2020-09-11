export declare type IterationIndex = number;
export declare type IterationNumber = number;
export declare type StackKey = ['stack', IterationNumber, IterationIndex];
export declare type Key = StackKey[];
export interface IEntity {
    uuid: string;
}
export declare type Iteration = (IEntity | IStack)[];
export interface IStack {
    stack: Iteration[];
    head?: IEntity;
}
export declare type Item = IEntity | Iteration | IStack;
export declare type IEntityMatcher = (x: IEntity) => boolean;
export declare const STACK_KEY_ITERATION_NUMBER = 1;
export declare const STACK_KEY_ITERATION_INDEX = 2;
export declare function createStack(firstIteration?: Iteration): IStack;
export declare function createStackFrom(iterations: Iteration[]): IStack;
export declare function _findHeadOn(stack: IStack): IEntity | undefined;
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
export declare function deepTruncateIterationsFrom(key: Key, stack: IStack): void;
export declare function truncateIterationFrom(key: Key, stack: IStack): Iteration;
export declare function cloneKeyAndMoveTo(stackKey: StackKey, key: Key, stack: IStack): Key;
export declare function moveStackIndexTo(dest: StackKey, key: Key): Key;
export declare function createStackKeyForLastIterAndLastIndexOf({ stack }: IStack): StackKey;
export declare function findHeadRightFrom(key: Key, stack: IStack, matcher: IEntityMatcher): Key | undefined;
export declare function shallowIndexOfRightFrom(key: Key, stack: IStack, matcher: IEntityMatcher): Key | undefined;
export declare function deepFindFrom(key: Key, stack: IStack, matcher: IEntityMatcher, originalKey?: Key): IEntity | undefined;
export declare function deepIndexOfFrom(key: Key, stack: IStack, matcher: IEntityMatcher, originalKey?: Key): Key | undefined;
//# sourceMappingURL=HierarchicalIterStack.d.ts.map