"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenPrompt = exports.OPEN_PROMPT_KEY = void 0;
const index_1 = require("../../../index");
exports.OPEN_PROMPT_KEY = 'Open';
class OpenPrompt extends index_1.BasePrompt {
    validate(val) {
        const { maxResponseCharacters: maxLength } = this.config;
        if (maxLength != null && val.length > maxLength) {
            throw new index_1.ValidationException('Too many characters on value provided');
        }
        return true;
    }
}
exports.OpenPrompt = OpenPrompt;
//# sourceMappingURL=OpenPrompt.js.map