"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class NumericResponseBlockRunner {
    constructor(block) {
        this.block = block;
    }
    initialize() {
        const { prompt, validationMinimum: min, validationMaximum: max, } = this.block.config;
        return {
            kind: __1.KnownPrompts.Numeric,
            prompt,
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