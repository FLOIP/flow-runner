"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BasePrompt_1 = tslib_1.__importDefault(require("./BasePrompt"));
var ValidationException_1 = tslib_1.__importDefault(require("../exceptions/ValidationException"));
var NumericPrompt = (function (_super) {
    tslib_1.__extends(NumericPrompt, _super);
    function NumericPrompt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumericPrompt.prototype.validate = function (val) {
        if (Number.isNaN(val) || val === null) {
            return false;
        }
        var _a = this.config, min = _a.min, max = _a.max;
        if (min != null && val < min) {
            throw new ValidationException_1.default('Value provided is less than allowed');
        }
        if (max != null && val > max) {
            throw new ValidationException_1.default('Value provided is greater than allowed');
        }
        return true;
    };
    return NumericPrompt;
}(BasePrompt_1.default));
exports.default = NumericPrompt;
//# sourceMappingURL=NumericPrompt.js.map