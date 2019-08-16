import PromptValidationException from '../exceptions/PromptValidationException';
export default interface IPrompt<PromptConfigType extends IPromptConfig<PromptConfigType['value']> & IBasePromptConfig> {
    interactionId: string;
    config: PromptConfigType;
    value: PromptConfigType['value'];
    error: PromptValidationException | null;
    isValid: boolean;
    validate(val: PromptConfigType['value']): boolean;
}
export declare enum KnownPrompts {
    Message = "Message",
    Numeric = "Numeric",
    SelectOne = "SelectOne",
    Open = "Open"
}
export interface IPromptConfig<ExpectationType> {
    kind: KnownPrompts;
    isResponseRequired: boolean;
    value?: ExpectationType;
}
export interface IBasePromptConfig {
    isSubmitted: boolean;
}
//# sourceMappingURL=IPrompt.d.ts.map