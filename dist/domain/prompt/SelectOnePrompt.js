"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BasePrompt_1 = tslib_1.__importDefault(require("./BasePrompt"));
var ValidationException_1 = tslib_1.__importDefault(require("../exceptions/ValidationException"));
var SelectOnePrompt = (function (_super) {
    tslib_1.__extends(SelectOnePrompt, _super);
    function SelectOnePrompt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectOnePrompt.prototype.validate = function (choiceKey) {
        var _a = this.config, isResponseRequired = _a.isResponseRequired, choices = _a.choices;
        if (isResponseRequired
            && choices.find(function (_a) {
                var key = _a.key;
                return key === choiceKey;
            }) == null) {
            throw new ValidationException_1.default('Value provided must be in list of choices');
        }
        return true;
    };
    return SelectOnePrompt;
}(BasePrompt_1.default));
exports.default = SelectOnePrompt;
//# sourceMappingURL=SelectOnePrompt.js.map