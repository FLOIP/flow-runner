"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectOneResponseBlockRunner = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
const lodash_1 = require("lodash");
class SelectOneResponseBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize({ value }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prompt, choices } = this.block.config;
            return {
                kind: __1.SELECT_ONE_PROMPT_KEY,
                prompt,
                isResponseRequired: true,
                choices: Object.keys(choices).map(key => ({
                    key,
                    value: choices[key],
                })),
                value: value,
            };
        });
    }
    run() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (_a = __1.findFirstTruthyEvaluatingBlockExitOn(this.block, this.context)) !== null && _a !== void 0 ? _a : lodash_1.last(this.block.exits);
        });
    }
}
exports.SelectOneResponseBlockRunner = SelectOneResponseBlockRunner;
//# sourceMappingURL=SelectOneResponseBlockRunner.js.map