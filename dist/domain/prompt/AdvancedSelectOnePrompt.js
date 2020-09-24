"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedSelectOnePrompt = exports.ADVANCED_SELECT_ONE_PROMPT_KEY = void 0;
const __1 = require("../..");
exports.ADVANCED_SELECT_ONE_PROMPT_KEY = 'AdvancedSelectOne';
class AdvancedSelectOnePrompt extends __1.BasePrompt {
    validate(selectedRow) {
        const { choiceRows } = this.config;
        selectedRow === null || selectedRow === void 0 ? void 0 : selectedRow.forEach(selection => {
            if (choiceRows.find(row => row.includes(selection.name)) === null)
                throw new __1.ValidationException('Value provided must be in list of choices');
        });
        return true;
    }
}
exports.AdvancedSelectOnePrompt = AdvancedSelectOnePrompt;
//# sourceMappingURL=AdvancedSelectOnePrompt.js.map