"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedSelectOnePrompt = exports.ADVANCED_SELECT_ONE_PROMPT_KEY = void 0;
const __1 = require("../..");
exports.ADVANCED_SELECT_ONE_PROMPT_KEY = 'AdvancedSelectOne';
class AdvancedSelectOnePrompt extends __1.BasePrompt {
    validateOrThrow(selectedRow, choiceRows) {
        const { choiceRowFields, isResponseRequired } = this.config;
        __1.assertNotNull(selectedRow, () => 'Value provided is null or undefined', message => new __1.PromptValidationException(message));
        __1.assertNotNull(choiceRows, () => 'choiceRows must be non-null', message => new __1.PromptValidationException(message));
        if (isResponseRequired) {
            const hasSelectedRow = choiceRows.some(row => selectedRow === null || selectedRow === void 0 ? void 0 : selectedRow.every(selection => {
                const columnIndex = choiceRowFields.indexOf(selection.name);
                if (columnIndex < 0) {
                    throw new __1.PromptValidationException(`Failed to find a column called: ${selection.name}`);
                }
                else {
                    return selection.value === row[columnIndex];
                }
            }));
            if (!hasSelectedRow) {
                throw new __1.PromptValidationException(`Failed to find the given row: ${selectedRow}`);
            }
        }
        return;
    }
}
exports.AdvancedSelectOnePrompt = AdvancedSelectOnePrompt;
//# sourceMappingURL=AdvancedSelectOnePrompt.js.map