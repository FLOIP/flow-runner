"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RunFlowBlockRunner = (function () {
    function RunFlowBlockRunner(block, context) {
        this.block = block;
        this.context = context;
    }
    RunFlowBlockRunner.prototype.initialize = function () {
        return undefined;
    };
    RunFlowBlockRunner.prototype.run = function () {
        return this.block.exits[0];
    };
    return RunFlowBlockRunner;
}());
exports.default = RunFlowBlockRunner;
//# sourceMappingURL=RunFlowBlockRunner.js.map