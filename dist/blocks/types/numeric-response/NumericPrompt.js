"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumericPrompt = exports.NUMERIC_PROMPT_KEY = void 0;
const index_1 = require("../../../index");
exports.NUMERIC_PROMPT_KEY = 'Numeric';
class NumericPrompt extends index_1.BasePrompt {
    validate(val) {
        if (Number.isNaN(val) || val === null) {
            return false;
        }
        const { min, max } = this.config;
        if (min != null && val < min) {
            throw new index_1.ValidationException('Value provided is less than allowed');
        }
        if (max != null && val > max) {
            throw new index_1.ValidationException('Value provided is greater than allowed');
        }
        return true;
    }
}
exports.NumericPrompt = NumericPrompt;
NumericPrompt.promptKey = 'Numeric';
//# sourceMappingURL=NumericPrompt.js.map