import { BasePrompt, IBlock, IFlowRunner, IRichCursorInputRequired } from '../..';
export interface IPrompt<PromptConfigType extends IPromptConfig<PromptConfigType['value']>> {
    interactionId: string;
    config: PromptConfigType;
    runner: IFlowRunner;
    block?: IBlock;
    value: PromptConfigType['value'];
    isValid(): boolean;
    validateOrThrow(val: PromptConfigType['value']): void;
    validate(val: PromptConfigType['value']): boolean;
    fulfill(val: PromptConfigType['value']): Promise<IRichCursorInputRequired | undefined>;
}
export interface IPromptConfig<T> extends IBasePromptConfig {
    kind: string;
    isResponseRequired: boolean;
    prompt: string;
    value?: T;
}
export interface IBasePromptConfig {
    isSubmitted?: boolean;
}
export interface PromptConstructor<T> {
    new (config: T, interactionId: string, runner: IFlowRunner): BasePrompt<any>;
}
//# sourceMappingURL=IPrompt.d.ts.map