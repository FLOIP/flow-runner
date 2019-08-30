"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BasePrompt_1 = tslib_1.__importDefault(require("./BasePrompt"));
const ValidationException_1 = tslib_1.__importDefault(require("../exceptions/ValidationException"));
class NumericPrompt extends BasePrompt_1.default {
    validate(val) {
        const { min, max } = this.config;
        if (min != null && val < min) {
            throw new ValidationException_1.default('Value provided is less than allowed');
        }
        if (max != null && val > max) {
            throw new ValidationException_1.default('Value provided is greater than allowed');
        }
        return true;
    }
}
exports.default = NumericPrompt;
//# sourceMappingURL=NumericPrompt.js.map