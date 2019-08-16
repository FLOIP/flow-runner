"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const PromptValidationException_1 = tslib_1.__importDefault(require("../exceptions/PromptValidationException"));
class BasePrompt {
    constructor(config, interactionId) {
        this.config = config;
        this.interactionId = interactionId;
        this.error = null;
        this.isValid = false;
    }
    get value() {
        return this.config.value;
    }
    set value(val) {
        try {
            this.isValid = this.validate(val);
        }
        catch (e) {
            if (!(e instanceof PromptValidationException_1.default)) {
                throw e;
            }
            this.error = e;
        }
        this.config.value = val;
    }
}
exports.default = BasePrompt;
//# sourceMappingURL=BasePrompt.js.map