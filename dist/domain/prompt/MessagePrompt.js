"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagePrompt = exports.MESSAGE_PROMPT_KEY = void 0;
const __1 = require("../..");
exports.MESSAGE_PROMPT_KEY = 'Message';
class MessagePrompt extends __1.BasePrompt {
    validate() {
        return true;
    }
}
exports.MessagePrompt = MessagePrompt;
//# sourceMappingURL=MessagePrompt.js.map