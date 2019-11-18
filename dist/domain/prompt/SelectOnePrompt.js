"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BasePrompt_1 = tslib_1.__importDefault(require("./BasePrompt"));
const ValidationException_1 = tslib_1.__importDefault(require("../exceptions/ValidationException"));
class SelectOnePrompt extends BasePrompt_1.default {
    validate(choiceKey) {
        const { isResponseRequired, choices } = this.config;
        if (isResponseRequired
            && choices.find(({ key }) => key === choiceKey) == null) {
            throw new ValidationException_1.default('Value provided must be in list of choices');
        }
        return true;
    }
}
exports.default = SelectOnePrompt;
//# sourceMappingURL=SelectOnePrompt.js.map