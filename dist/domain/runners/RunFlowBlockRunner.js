"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunFlowBlockRunner = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
class RunFlowBlockRunner {
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
            try {
                __1.setContactProperty(this.block, this.context);
                return __1.firstTrueOrNullBlockExitOrThrow(this.block, this.context);
            }
            catch (e) {
                console.error(e);
                return __1.findDefaultBlockExitOrThrow(this.block);
            }
        });
    }
}
exports.RunFlowBlockRunner = RunFlowBlockRunner;
//# sourceMappingURL=RunFlowBlockRunner.js.map