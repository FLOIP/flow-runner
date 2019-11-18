"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
var NumericResponseBlockRunner = (function () {
    function NumericResponseBlockRunner(block, context) {
        this.block = block;
        this.context = context;
    }
    NumericResponseBlockRunner.prototype.initialize = function (_a) {
        var value = _a.value;
        var _b = this.block.config, prompt = _b.prompt, min = _b.validationMinimum, max = _b.validationMaximum;
        return {
            kind: __1.KnownPrompts.Numeric,
            prompt: prompt,
            isResponseRequired: false,
            min: min,
            max: max,
            value: value,
        };
    };
    NumericResponseBlockRunner.prototype.run = function () {
        return this.block.exits[0];
    };
    return NumericResponseBlockRunner;
}());
exports.default = NumericResponseBlockRunner;
//# sourceMappingURL=NumericResponseBlockRunner.js.map