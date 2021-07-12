"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseBlockRunner = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const iBlockExit = __1.firstTrueBlockExitOrThrow(this.block, this.context);
            return iBlockExit;
        });
    }
}
exports.CaseBlockRunner = CaseBlockRunner;
//# sourceMappingURL=CaseBlockRunner.js.map