import PromptValidationException from "../exceptions/PromptValidationException";
import IBlock from "../../flow-spec/IBlock";
import IBlockInteraction from "../../flow-spec/IBlockInteraction";
export default interface IPrompt<PromptConfigType extends IPromptConfig<PromptConfigType['value']> & IBasePromptConfig> {
    block: IBlock;
    interaction: IBlockInteraction;
    config: PromptConfigType;
    value: PromptConfigType['value'];
    error: PromptValidationException | null;
    isValid: boolean;
    validate(val: PromptConfigType['value']): boolean;
}
export declare enum KnownPrompts {
    Message = 0,
    Numeric = 1,
    SelectOne = 2,
    Open = 3
}
export interface IPromptConfig<ExpectationType> {
    kind: KnownPrompts;
    isResponseRequired: boolean;
    value: ExpectationType;
}
export interface IBasePromptConfig {
    isSubmitted: boolean;
}
//# sourceMappingURL=IPrompt.d.ts.map