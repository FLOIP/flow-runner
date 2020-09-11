"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectManyPrompt = exports.SELECT_MANY_PROMPT_KEY = exports.INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK = exports.INVALID_AT_LEAST_ONE_SELECTION_REQUIRED = void 0;
const index_1 = require("../../../index");
const lodash_1 = require("lodash");
exports.INVALID_AT_LEAST_ONE_SELECTION_REQUIRED = 'At least one selection is required, but none provided';
exports.INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK = 'All selections must be valid choices on block';
exports.SELECT_MANY_PROMPT_KEY = 'SelectMany';
class SelectManyPrompt extends index_1.BasePrompt {
    validate(selections) {
        const { isResponseRequired, choices } = this.config;
        if (!isResponseRequired) {
            return true;
        }
        if (selections.length === 0) {
            throw new index_1.ValidationException(exports.INVALID_AT_LEAST_ONE_SELECTION_REQUIRED);
        }
        const invalidChoices = lodash_1.difference(selections, lodash_1.map(choices, 'key'));
        if (invalidChoices.length !== 0) {
            throw new index_1.InvalidChoiceException(exports.INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK, invalidChoices);
        }
        return true;
    }
}
exports.SelectManyPrompt = SelectManyPrompt;
//# sourceMappingURL=SelectManyPrompt.js.map