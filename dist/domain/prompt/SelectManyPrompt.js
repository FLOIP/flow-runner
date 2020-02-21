"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BasePrompt_1 = tslib_1.__importDefault(require("./BasePrompt"));
const ValidationException_1 = tslib_1.__importDefault(require("../exceptions/ValidationException"));
const lodash_1 = require("lodash");
const InvalidChoiceException_1 = tslib_1.__importDefault(require("../exceptions/InvalidChoiceException"));
exports.INVALID_AT_LEAST_ONE_SELECTION_REQUIRED = 'At least one selection is required, but none provided';
exports.INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK = 'All selections must be valid choices on block';
class SelectManyPrompt extends BasePrompt_1.default {
    validate(selections) {
        const { isResponseRequired, choices } = this.config;
        if (!isResponseRequired) {
            return true;
        }
        if (selections.length === 0) {
            throw new ValidationException_1.default(exports.INVALID_AT_LEAST_ONE_SELECTION_REQUIRED);
        }
        const invalidChoices = lodash_1.difference(selections, lodash_1.map(choices, 'key'));
        if (invalidChoices.length !== 0) {
            throw new InvalidChoiceException_1.default(exports.INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK, invalidChoices);
        }
        return true;
    }
}
exports.SelectManyPrompt = SelectManyPrompt;
exports.default = SelectManyPrompt;
//# sourceMappingURL=SelectManyPrompt.js.map