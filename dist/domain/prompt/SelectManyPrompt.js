"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BasePrompt_1 = tslib_1.__importDefault(require("./BasePrompt"));
var ValidationException_1 = tslib_1.__importDefault(require("../exceptions/ValidationException"));
var lodash_1 = require("lodash");
var InvalidChoiceException_1 = tslib_1.__importDefault(require("../exceptions/InvalidChoiceException"));
exports.INVALID_AT_LEAST_ONE_SELECTION_REQUIRED = 'At least one selection is required, but none provided';
exports.INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK = 'All selections must be valid choices on block';
var SelectManyPrompt = (function (_super) {
    tslib_1.__extends(SelectManyPrompt, _super);
    function SelectManyPrompt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectManyPrompt.prototype.validate = function (selections) {
        var _a = this.config, isResponseRequired = _a.isResponseRequired, choices = _a.choices;
        if (!isResponseRequired) {
            return true;
        }
        if (selections.length === 0) {
            throw new ValidationException_1.default(exports.INVALID_AT_LEAST_ONE_SELECTION_REQUIRED);
        }
        var invalidChoices = lodash_1.difference(selections, lodash_1.map(choices, 'key'));
        if (invalidChoices.length !== 0) {
            throw new InvalidChoiceException_1.default(exports.INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK, invalidChoices);
        }
        return true;
    };
    return SelectManyPrompt;
}(BasePrompt_1.default));
exports.default = SelectManyPrompt;
//# sourceMappingURL=SelectManyPrompt.js.map