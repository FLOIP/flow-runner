"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumericResponseBlockRunner = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../index");
class NumericResponseBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize({ value }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prompt, validationMinimum: min, validationMaximum: max } = this.block.config;
            return {
                kind: index_1.NUMERIC_PROMPT_KEY,
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
            index_1.setContactProperty(this.block, this.context);
            return this.block.exits[0];
        });
    }
}
exports.NumericResponseBlockRunner = NumericResponseBlockRunner;
//# sourceMappingURL=NumericResponseBlockRunner.js.map