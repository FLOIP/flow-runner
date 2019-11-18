"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
var IBlock_1 = require("../../flow-spec/IBlock");
var CaseBlockRunner = (function () {
    function CaseBlockRunner(block, context) {
        this.block = block;
        this.context = context;
    }
    CaseBlockRunner.prototype.initialize = function () {
        return undefined;
    };
    CaseBlockRunner.prototype.run = function () {
        var truthyExit = IBlock_1.findFirstTruthyEvaluatingBlockExitOn(this.block, this.context);
        return (truthyExit != null
            ? truthyExit
            : __1.findDefaultBlockExitOn(this.block));
    };
    return CaseBlockRunner;
}());
exports.default = CaseBlockRunner;
//# sourceMappingURL=CaseBlockRunner.js.map