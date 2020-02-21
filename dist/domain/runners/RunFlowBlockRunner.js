"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RunFlowBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        return undefined;
    }
    run() {
        return this.block.exits[0];
    }
}
exports.RunFlowBlockRunner = RunFlowBlockRunner;
exports.default = RunFlowBlockRunner;
//# sourceMappingURL=RunFlowBlockRunner.js.map