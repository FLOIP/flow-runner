"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RunFlowBlockRunner {
    constructor(block, resources) {
        this.block = block;
        this.resources = resources;
    }
    initialize() {
        return undefined;
    }
    run() {
        return this.block.exits[0];
    }
}
exports.default = RunFlowBlockRunner;
//# sourceMappingURL=RunFlowBlockRunner.js.map