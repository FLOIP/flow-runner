"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RunFlowBlockRunner {
    constructor(block) {
        this.block = block;
    }
    initialize(interaction) {
        return null;
    }
    run(cursor) {
        return this.block.exits[0];
    }
}
exports.default = RunFlowBlockRunner;
//# sourceMappingURL=RunFlowBlockRunner.js.map