import { BasePrompt, IBlock, IFlowRunner, IRichCursorInputRequired, PromptValidationException } from '../..';
export interface IPrompt<PromptConfigType extends IPromptConfig<PromptConfigType['value']> = IPromptConfig> {
    interactionId: string;
    config: PromptConfigType;
    runner: IFlowRunner;
    block?: IBlock;
    value: PromptConfigType['value'];
    error: PromptValidationException | null;
    isValid(): boolean;
    validate(val: PromptConfigType['value']): boolean;
    fulfill(val: PromptConfigType['value']): Promise<IRichCursorInputRequired | undefined>;
}
export interface IPromptConfig<VALUE_TYPE = unknown> extends IBasePromptConfig {
    kind: string;
    isResponseRequired: boolean;
    prompt?: string;
    value?: VALUE_TYPE;
}
export interface IBasePromptConfig {
    isSubmitted?: boolean;
}
export interface PromptConstructor<T extends IPromptConfig> {
    new (config: T, interactionId: string, runner: IFlowRunner): BasePrompt<T>;
}
//# sourceMappingURL=IPrompt.d.ts.map