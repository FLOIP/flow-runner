"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BasePrompt_1 = tslib_1.__importDefault(require("./BasePrompt"));
var ValidationException_1 = tslib_1.__importDefault(require("../exceptions/ValidationException"));
var OpenPrompt = (function (_super) {
    tslib_1.__extends(OpenPrompt, _super);
    function OpenPrompt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OpenPrompt.prototype.validate = function (val) {
        var maxLength = this.config.maxResponseCharacters;
        if (maxLength && val.length > maxLength) {
            throw new ValidationException_1.default('Too many characters on value provided');
        }
        return true;
    };
    return OpenPrompt;
}(BasePrompt_1.default));
exports.default = OpenPrompt;
//# sourceMappingURL=OpenPrompt.js.map