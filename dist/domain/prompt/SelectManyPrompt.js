"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectManyPrompt = exports.SELECT_MANY_PROMPT_KEY = exports.INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK = exports.INVALID_AT_LEAST_ONE_SELECTION_REQUIRED = void 0;
const __1 = require("../..");
const lodash_1 = require("lodash");
exports.INVALID_AT_LEAST_ONE_SELECTION_REQUIRED = 'At least one selection is required, but none provided';
exports.INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK = 'All selections must be valid choices on block';
exports.SELECT_MANY_PROMPT_KEY = 'SelectMany';
class SelectManyPrompt extends __1.BasePrompt {
    validate(selections) {
        if (selections == null) {
            throw new __1.PromptValidationException('Value provided is null or undefined');
        }
        const { isResponseRequired, choices } = this.config;
        if (!isResponseRequired) {
            return;
        }
        if (choices.length !== 0 && selections.length === 0) {
            throw new __1.PromptValidationException(exports.INVALID_AT_LEAST_ONE_SELECTION_REQUIRED);
        }
        const invalidChoices = lodash_1.difference(selections, lodash_1.map(choices, 'key'));
        if (invalidChoices.length !== 0) {
            throw new __1.InvalidChoiceException(exports.INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK, invalidChoices);
        }
        return;
    }
}
exports.SelectManyPrompt = SelectManyPrompt;
//# sourceMappingURL=SelectManyPrompt.js.map