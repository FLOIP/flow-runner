"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidChoiceException = void 0;
class InvalidChoiceException extends Error {
    constructor(message, choices) {
        super(message);
        this.choices = choices;
    }
}
exports.InvalidChoiceException = InvalidChoiceException;
//# sourceMappingURL=InvalidChoiceException.js.map