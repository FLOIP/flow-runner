import IPrompt, { IBasePromptConfig, IPromptConfig } from './IPrompt';
import PromptValidationException from '../exceptions/PromptValidationException';
import IFlowRunner from '../IFlowRunner';
import { IRichCursorInputRequired } from '../..';
export declare type TGenericPrompt = IPrompt<IPromptConfig<any> & IBasePromptConfig>;
export interface IBasePromptConstructor {
    new (): IPrompt<IPromptConfig<any> & IBasePromptConfig>;
}
export declare abstract class BasePrompt<PromptConfigType extends IPromptConfig<PromptConfigType['value']> & IBasePromptConfig> implements IPrompt<PromptConfigType> {
    config: PromptConfigType & IBasePromptConfig;
    interactionId: string;
    runner: IFlowRunner;
    error: PromptValidationException | null;
    isValid: boolean;
    constructor(config: PromptConfigType & IBasePromptConfig, interactionId: string, runner: IFlowRunner);
    get value(): PromptConfigType['value'];
    set value(val: PromptConfigType['value']);
    get isEmpty(): boolean;
    fulfill(val: PromptConfigType['value'] | undefined): Promise<IRichCursorInputRequired | undefined>;
    abstract validate(val?: PromptConfigType['value']): boolean;
}
export default BasePrompt;
//# sourceMappingURL=BasePrompt.d.ts.map