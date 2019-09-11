"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("../..");
const ResourceResolver_1 = tslib_1.__importDefault(require("../ResourceResolver"));
class NumericResponseBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        const { prompt, validationMinimum: min, validationMaximum: max, } = this.block.config;
        return {
            kind: __1.KnownPrompts.Numeric,
            prompt: (new ResourceResolver_1.default(this.context)).resolve(prompt),
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