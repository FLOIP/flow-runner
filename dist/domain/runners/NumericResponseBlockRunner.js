"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class NumericResponseBlockRunner {
    constructor(block, resources) {
        this.block = block;
        this.resources = resources;
    }
    initialize() {
        const { prompt, validationMinimum: min, validationMaximum: max, } = this.block.config;
        return {
            kind: __1.KnownPrompts.Numeric,
            prompt: this.resources.resolve(prompt),
            isResponseRequired: false,
            min,
            max,
        };
    }
    run() {
        return this.block.exits[0];
    }
}
exports.default = NumericResponseBlockRunner;
//# sourceMappingURL=NumericResponseBlockRunner.js.map