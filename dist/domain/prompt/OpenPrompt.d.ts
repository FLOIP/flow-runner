import BasePrompt from './BasePrompt';
import { IBasePromptConfig } from './IPrompt';
import { IOpenPromptConfig } from './IOpenPromptConfig';
export default class OpenPrompt extends BasePrompt<IOpenPromptConfig & IBasePromptConfig> {
    validate(val: string): boolean;
}
//# sourceMappingURL=OpenPrompt.d.ts.map