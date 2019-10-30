"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
const lodash_1 = require("lodash");
class SelectOneResponseBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        const { prompt, choices } = this.block.config;
        return {
            kind: __1.KnownPrompts.SelectOne,
            prompt,
            isResponseRequired: true,
            choices: Object.keys(choices)
                .map(key => ({
                key,
                value: choices[key],
            })),
        };
    }
    run() {
        const truthyExit = __1.findFirstTruthyEvaluatingBlockExitOn(this.block, this.context);
        return (truthyExit != null
            ? truthyExit
            : lodash_1.last(this.block.exits));
    }
}
exports.default = SelectOneResponseBlockRunner;
//# sourceMappingURL=SelectOneResponseBlockRunner.js.map