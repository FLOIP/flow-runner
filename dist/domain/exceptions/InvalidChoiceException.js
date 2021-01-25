"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidChoiceException = void 0;
const PromptValidationException_1 = require("./PromptValidationException");
class InvalidChoiceException extends PromptValidationException_1.PromptValidationException {
    constructor(message, choices) {
        super(message);
        this.choices = choices;
    }
}
exports.InvalidChoiceException = InvalidChoiceException;
//# sourceMappingURL=InvalidChoiceException.js.map