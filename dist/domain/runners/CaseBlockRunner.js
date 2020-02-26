"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("../..");
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return _a = __1.findFirstTruthyEvaluatingBlockExitOn(this.block, this.context), (_a !== null && _a !== void 0 ? _a : __1.findDefaultBlockExitOn(this.block));
        });
    }
}
exports.CaseBlockRunner = CaseBlockRunner;
exports.default = CaseBlockRunner;
//# sourceMappingURL=CaseBlockRunner.js.map