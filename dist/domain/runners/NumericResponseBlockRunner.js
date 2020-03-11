"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("../..");
class NumericResponseBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize({ value }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prompt, validationMinimum: min, validationMaximum: max, } = this.block.config;
            return {
                kind: __1.KnownPrompts.Numeric,
                prompt,
                isResponseRequired: false,
                min,
                max,
                value: value,
            };
        });
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.block.exits[0];
        });
    }
}
exports.NumericResponseBlockRunner = NumericResponseBlockRunner;
exports.default = NumericResponseBlockRunner;
//# sourceMappingURL=NumericResponseBlockRunner.js.map