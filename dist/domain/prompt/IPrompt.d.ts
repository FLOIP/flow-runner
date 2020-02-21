import PromptValidationException from '../exceptions/PromptValidationException';
import IFlowRunner from '../IFlowRunner';
import { IRichCursorInputRequired } from '../..';
export interface IPrompt<PromptConfigType extends IPromptConfig<PromptConfigType['value']> & IBasePromptConfig> {
    interactionId: string;
    config: PromptConfigType;
    runner: IFlowRunner;
    value: PromptConfigType['value'];
    error: PromptValidationException | null;
    isValid: boolean;
    validate(val: PromptConfigType['value']): boolean;
    fulfill(val: PromptConfigType['value']): IRichCursorInputRequired | undefined;
}
export default IPrompt;
export declare enum KnownPrompts {
    Message = "Message",
    Numeric = "Numeric",
    SelectOne = "SelectOne",
    SelectMany = "SelectMany",
    Open = "Open",
    Read = "Read"
}
export interface IPromptConfig<ExpectationType> {
    kind: keyof typeof KnownPrompts;
    isResponseRequired: boolean;
    prompt: string;
    value?: ExpectationType;
}
export interface IBasePromptConfig {
    isSubmitted: boolean;
}
//# sourceMappingURL=IPrompt.d.ts.map