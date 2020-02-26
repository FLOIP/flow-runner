"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("../..");
const IBlock_1 = require("../../flow-spec/IBlock");
const lodash_1 = require("lodash");
class SelectOneResponseBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize({ value }) {
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
            value: value,
        };
    }
    run() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return _a = IBlock_1.findFirstTruthyEvaluatingBlockExitOn(this.block, this.context), (_a !== null && _a !== void 0 ? _a : lodash_1.last(this.block.exits));
        });
    }
}
exports.SelectOneResponseBlockRunner = SelectOneResponseBlockRunner;
exports.default = SelectOneResponseBlockRunner;
//# sourceMappingURL=SelectOneResponseBlockRunner.js.map