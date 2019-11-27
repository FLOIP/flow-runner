import PromptValidationException from '../exceptions/PromptValidationException';
import IFlowRunner from '../IFlowRunner';
import { RichCursorInputRequiredType } from '../..';
export default interface IPrompt<PromptConfigType extends IPromptConfig<PromptConfigType['value']> & IBasePromptConfig> {
    interactionId: string;
    config: PromptConfigType;
    runner: IFlowRunner;
    value: PromptConfigType['value'];
    error: PromptValidationException | null;
    isValid: boolean;
    validate(val: PromptConfigType['value']): boolean;
    fulfill(val: PromptConfigType['value']): RichCursorInputRequiredType | undefined;
}
export declare enum KnownPrompts {
    Message = "Message",
    Numeric = "Numeric",
    SelectOne = "SelectOne",
    SelectMany = "SelectMany",
    Open = "Open",
    SetContact = "SetContact"
}
export interface IPromptConfig<ExpectationType> {
    kind: KnownPrompts;
    isResponseRequired: boolean;
    prompt: string;
    value?: ExpectationType;
}
export interface IBasePromptConfig {
    isSubmitted: boolean;
}
//# sourceMappingURL=IPrompt.d.ts.map