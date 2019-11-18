"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BasePrompt_1 = tslib_1.__importDefault(require("./BasePrompt"));
var MessagePrompt = (function (_super) {
    tslib_1.__extends(MessagePrompt, _super);
    function MessagePrompt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MessagePrompt.prototype.validate = function () {
        return true;
    };
    return MessagePrompt;
}(BasePrompt_1.default));
exports.default = MessagePrompt;
//# sourceMappingURL=MessagePrompt.js.map