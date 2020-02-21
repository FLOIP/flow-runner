"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const PromptValidationException_1 = tslib_1.__importDefault(require("../exceptions/PromptValidationException"));
class BasePrompt {
    constructor(config, interactionId, runner) {
        this.config = config;
        this.interactionId = interactionId;
        this.runner = runner;
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
    get isEmpty() {
        return this.value === undefined;
    }
    fulfill(val) {
        if (val !== undefined) {
            this.value = val;
        }
        return this.runner.run();
    }
}
exports.BasePrompt = BasePrompt;
exports.default = BasePrompt;
//# sourceMappingURL=BasePrompt.js.map