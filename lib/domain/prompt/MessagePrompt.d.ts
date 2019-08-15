import BasePrompt from './BasePrompt';
import { IBasePromptConfig } from './IPrompt';
import { IMessagePromptConfig } from './IMessagePromptConfig';
export default class MessagePrompt extends BasePrompt<IMessagePromptConfig & IBasePromptConfig> {
    validate(): boolean;
}
//# sourceMappingURL=MessagePrompt.d.ts.map