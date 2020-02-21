"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
const __2 = require("../..");
class CaseBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        return undefined;
    }
    run() {
        var _a;
        return _a = __2.findFirstTruthyEvaluatingBlockExitOn(this.block, this.context), (_a !== null && _a !== void 0 ? _a : __1.findDefaultBlockExitOn(this.block));
    }
}
exports.CaseBlockRunner = CaseBlockRunner;
exports.default = CaseBlockRunner;
//# sourceMappingURL=CaseBlockRunner.js.map