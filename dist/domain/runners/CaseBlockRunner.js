"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
const IBlock_1 = require("../../flow-spec/IBlock");
class CaseBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        return undefined;
    }
    run() {
        const truthyExit = IBlock_1.findFirstTruthyEvaluatingBlockExitOn(this.block, this.context);
        return (truthyExit != null
            ? truthyExit
            : __1.findDefaultBlockExitOn(this.block));
    }
}
exports.default = CaseBlockRunner;
//# sourceMappingURL=CaseBlockRunner.js.map