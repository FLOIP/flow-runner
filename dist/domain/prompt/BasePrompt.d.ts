import IPrompt, { IBasePromptConfig, IPromptConfig } from './IPrompt';
import PromptValidationException from '../exceptions/PromptValidationException';
import IFlowRunner from '../IFlowRunner';
import { RichCursorInputRequiredType } from '../..';
export default abstract class BasePrompt<PromptConfigType extends IPromptConfig<PromptConfigType['value']> & IBasePromptConfig> implements IPrompt<PromptConfigType> {
    config: PromptConfigType & IBasePromptConfig;
    interactionId: string;
    runner: IFlowRunner;
    error: PromptValidationException | null;
    isValid: boolean;
    constructor(config: PromptConfigType & IBasePromptConfig, interactionId: string, runner: IFlowRunner);
    value: PromptConfigType['value'];
    readonly isEmpty: boolean;
    fulfill(val: PromptConfigType['value']): RichCursorInputRequiredType | undefined;
    abstract validate(val?: PromptConfigType['value']): boolean;
}
//# sourceMappingURL=BasePrompt.d.ts.map