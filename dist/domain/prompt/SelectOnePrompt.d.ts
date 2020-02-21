import BasePrompt from './BasePrompt';
import { IBasePromptConfig } from './IPrompt';
import { ISelectOnePromptConfig } from './ISelectOnePromptConfig';
export declare class SelectOnePrompt extends BasePrompt<ISelectOnePromptConfig & IBasePromptConfig> {
    validate(choiceKey: string): boolean;
}
export default SelectOnePrompt;
//# sourceMappingURL=SelectOnePrompt.d.ts.map