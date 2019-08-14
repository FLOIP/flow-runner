"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const PromptValidationException_1 = tslib_1.__importDefault(require("../exceptions/PromptValidationException"));
class default_1 {
    constructor(block, interaction, config) {
        this.block = block;
        this.interaction = interaction;
        this.config = config;
    }
    get value() {
        return this.config.value;
    }
    set value(val) {
        try {
            this.validate(val);
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
exports.default = default_1;
//# sourceMappingURL=BasePrompt.js.map