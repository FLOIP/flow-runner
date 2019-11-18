"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidChoiceException extends Error {
    constructor(message, choices) {
        super(message);
        this.choices = choices;
    }
}
exports.default = InvalidChoiceException;
//# sourceMappingURL=InvalidChoiceException.js.map