"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var InvalidChoiceException = (function (_super) {
    tslib_1.__extends(InvalidChoiceException, _super);
    function InvalidChoiceException(message, choices) {
        var _this = _super.call(this, message) || this;
        _this.choices = choices;
        return _this;
    }
    return InvalidChoiceException;
}(Error));
exports.default = InvalidChoiceException;
//# sourceMappingURL=InvalidChoiceException.js.map