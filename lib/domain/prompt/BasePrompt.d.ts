import IPrompt, { IBasePromptConfig, IPromptConfig } from './IPrompt';
import PromptValidationException from '../exceptions/PromptValidationException';
export default abstract class BasePrompt<PromptConfigType extends IPromptConfig<PromptConfigType['value']> & IBasePromptConfig> implements IPrompt<PromptConfigType> {
    config: PromptConfigType & IBasePromptConfig;
    interactionId: string;
    error: PromptValidationException | null;
    isValid: boolean;
    constructor(config: PromptConfigType & IBasePromptConfig, interactionId: string);
    value: PromptConfigType['value'];
    abstract validate(val?: PromptConfigType['value']): boolean;
}
//# sourceMappingURL=BasePrompt.d.ts.map