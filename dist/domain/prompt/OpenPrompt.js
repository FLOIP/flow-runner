"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenPrompt = exports.OPEN_PROMPT_KEY = void 0;
const __1 = require("../..");
exports.OPEN_PROMPT_KEY = 'Open';
class OpenPrompt extends __1.BasePrompt {
    validate(val) {
        if (val == null) {
            throw new __1.PromptValidationException('Value provided is null or undefined');
        }
        const { maxResponseCharacters: maxLength } = this.config;
        if (maxLength != null && val.length > maxLength) {
            throw new __1.PromptValidationException('Too many characters on value provided');
        }
        return;
    }
}
exports.OpenPrompt = OpenPrompt;
//# sourceMappingURL=OpenPrompt.js.map