"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectOnePrompt = exports.SELECT_ONE_PROMPT_KEY = void 0;
const __1 = require("../..");
exports.SELECT_ONE_PROMPT_KEY = 'SelectOne';
class SelectOnePrompt extends __1.BasePrompt {
    validate(choiceKey) {
        if (choiceKey == null) {
            throw new __1.PromptValidationException('Value provided is null or undefined');
        }
        const { isResponseRequired, choices } = this.config;
        if (isResponseRequired && choices.find(({ key }) => key === choiceKey) == null) {
            throw new __1.PromptValidationException('Value provided must be in list of choices');
        }
        return;
    }
}
exports.SelectOnePrompt = SelectOnePrompt;
//# sourceMappingURL=SelectOnePrompt.js.map