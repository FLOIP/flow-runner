"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectOnePrompt = exports.SELECT_ONE_PROMPT_KEY = void 0;
const index_1 = require("../../../index");
exports.SELECT_ONE_PROMPT_KEY = 'SelectOne';
class SelectOnePrompt extends index_1.BasePrompt {
    validate(choiceKey) {
        const { isResponseRequired, choices } = this.config;
        if (isResponseRequired && choices.find(({ key }) => key === choiceKey) == null) {
            throw new index_1.ValidationException('Value provided must be in list of choices');
        }
        return true;
    }
}
exports.SelectOnePrompt = SelectOnePrompt;
//# sourceMappingURL=SelectOnePrompt.js.map