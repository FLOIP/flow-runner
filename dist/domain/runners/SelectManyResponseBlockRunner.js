"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
const lodash_1 = require("lodash");
class SelectManyResponseBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize({ value }) {
        const { prompt, choices } = this.block.config;
        return {
            kind: __1.KnownPrompts.SelectMany,
            prompt,
            isResponseRequired: true,
            choices: Object.keys(choices)
                .map(key => ({
                key,
                value: choices[key],
            })),
            value: value,
        };
    }
    run() {
        var _a;
        return _a = __1.findFirstTruthyEvaluatingBlockExitOn(this.block, this.context), (_a !== null && _a !== void 0 ? _a : lodash_1.last(this.block.exits));
    }
}
exports.SelectManyResponseBlockRunner = SelectManyResponseBlockRunner;
exports.default = SelectManyResponseBlockRunner;
//# sourceMappingURL=SelectManyResponseBlockRunner.js.map