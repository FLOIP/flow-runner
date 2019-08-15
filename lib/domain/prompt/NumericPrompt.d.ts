import BasePrompt from './BasePrompt';
import { INumericPromptConfig } from './INumericPromptConfig';
import { IBasePromptConfig } from './IPrompt';
export default class extends BasePrompt<INumericPromptConfig & IBasePromptConfig> {
    validate(val: number): boolean;
}
//# sourceMappingURL=NumericPrompt.d.ts.map