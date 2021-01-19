"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumericPrompt = exports.NUMERIC_PROMPT_KEY = void 0;
const __1 = require("../..");
exports.NUMERIC_PROMPT_KEY = 'Numeric';
class NumericPrompt extends __1.BasePrompt {
    validate(val) {
        if (Number.isNaN(val) || val == null) {
            return false;
        }
        const { min, max } = this.config;
        if (min != null && val < min) {
            throw new __1.PromptValidationException('Value provided is less than allowed');
        }
        if (max != null && val > max) {
            throw new __1.PromptValidationException('Value provided is greater than allowed');
        }
        return true;
    }
}
exports.NumericPrompt = NumericPrompt;
NumericPrompt.promptKey = 'Numeric';
//# sourceMappingURL=NumericPrompt.js.map