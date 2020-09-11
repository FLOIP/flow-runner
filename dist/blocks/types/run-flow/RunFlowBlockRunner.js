"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunFlowBlockRunner = void 0;
const tslib_1 = require("tslib");
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
            return this.block.exits[0];
        });
    }
}
exports.RunFlowBlockRunner = RunFlowBlockRunner;
//# sourceMappingURL=RunFlowBlockRunner.js.map