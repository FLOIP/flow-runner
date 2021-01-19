import { IBlock, IFlowRunner, IPrompt, IPromptConfig, IRichCursorInputRequired } from '../..';
export declare type TGenericPrompt = IPrompt<IPromptConfig<any>>;
export declare abstract class BasePrompt<T extends IPromptConfig<T['value']>> implements IPrompt<T> {
    config: T;
    interactionId: string;
    runner: IFlowRunner;
    constructor(config: T, interactionId: string, runner: IFlowRunner);
    get value(): T['value'];
    set value(val: T['value']);
    get isEmpty(): boolean;
    get block(): IBlock | undefined;
    fulfill(val: T['value'] | undefined): Promise<IRichCursorInputRequired | undefined>;
    isValid(): boolean;
    abstract validate(val?: T['value']): boolean;
}
//# sourceMappingURL=BasePrompt.d.ts.map