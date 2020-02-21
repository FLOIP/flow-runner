import BasePrompt from './BasePrompt';
import { INumericPromptConfig } from './INumericPromptConfig';
import { IBasePromptConfig } from './IPrompt';
export declare class NumericPrompt extends BasePrompt<INumericPromptConfig & IBasePromptConfig> {
    validate(val: number): boolean;
}
export default NumericPrompt;
//# sourceMappingURL=NumericPrompt.d.ts.map