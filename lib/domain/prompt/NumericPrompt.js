"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BasePrompt_1 = tslib_1.__importDefault(require("./BasePrompt"));
class NumericPrompt extends BasePrompt_1.default {
    validate(val) {
        return val >= this.config.min
            && val <= this.config.max;
    }
}
exports.default = NumericPrompt;
//# sourceMappingURL=NumericPrompt.js.map