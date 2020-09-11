"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseBlockRunner = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../index");
class CaseBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    run() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (_a = index_1.findFirstTruthyEvaluatingBlockExitOn(this.block, this.context)) !== null && _a !== void 0 ? _a : index_1.findDefaultBlockExitOn(this.block);
        });
    }
}
exports.CaseBlockRunner = CaseBlockRunner;
//# sourceMappingURL=CaseBlockRunner.js.map