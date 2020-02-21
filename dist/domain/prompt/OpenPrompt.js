"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BasePrompt_1 = tslib_1.__importDefault(require("./BasePrompt"));
const ValidationException_1 = tslib_1.__importDefault(require("../exceptions/ValidationException"));
class OpenPrompt extends BasePrompt_1.default {
    validate(val) {
        const { maxResponseCharacters: maxLength } = this.config;
        if (maxLength && val.length > maxLength) {
            throw new ValidationException_1.default('Too many characters on value provided');
        }
        return true;
    }
}
exports.OpenPrompt = OpenPrompt;
exports.default = OpenPrompt;
//# sourceMappingURL=OpenPrompt.js.map