import BasePrompt from './BasePrompt';
import { IBasePromptConfig } from './IPrompt';
import { ISelectOnePromptConfig } from './ISelectOnePromptConfig';
export default class SelectOnePrompt extends BasePrompt<ISelectOnePromptConfig & IBasePromptConfig> {
    validate(choiceKey: string): boolean;
}
//# sourceMappingURL=SelectOnePrompt.d.ts.map