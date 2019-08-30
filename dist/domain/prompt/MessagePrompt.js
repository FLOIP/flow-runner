"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BasePrompt_1 = tslib_1.__importDefault(require("./BasePrompt"));
class MessagePrompt extends BasePrompt_1.default {
    validate() {
        return true;
    }
}
exports.default = MessagePrompt;
//# sourceMappingURL=MessagePrompt.js.map