"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IPrompt_1 = require("../prompt/IPrompt");
class NumericResponseBlockRunner {
    constructor(block) {
        this.block = block;
    }
    initialize() {
        return {
            kind: IPrompt_1.KnownPrompts.Numeric,
            maxLength: 0,
            min: this.block.config.validationMinimum,
            max: this.block.config.validationMaximum,
            isResponseRequired: false,
            prompt: this.block.config.prompt,
        };
    }
    run() {
        return this.block.exits[0];
    }
}
exports.default = NumericResponseBlockRunner;
//# sourceMappingURL=NumericResponseBlockRunner.js.map