"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
var IBlock_1 = require("../../flow-spec/IBlock");
var lodash_1 = require("lodash");
var SelectOneResponseBlockRunner = (function () {
    function SelectOneResponseBlockRunner(block, context) {
        this.block = block;
        this.context = context;
    }
    SelectOneResponseBlockRunner.prototype.initialize = function (_a) {
        var value = _a.value;
        var _b = this.block.config, prompt = _b.prompt, choices = _b.choices;
        return {
            kind: __1.KnownPrompts.SelectOne,
            prompt: prompt,
            isResponseRequired: true,
            choices: Object.keys(choices)
                .map(function (key) { return ({
                key: key,
                value: choices[key],
            }); }),
            value: value,
        };
    };
    SelectOneResponseBlockRunner.prototype.run = function () {
        var truthyExit = IBlock_1.findFirstTruthyEvaluatingBlockExitOn(this.block, this.context);
        return (truthyExit != null
            ? truthyExit
            : lodash_1.last(this.block.exits));
    };
    return SelectOneResponseBlockRunner;
}());
exports.default = SelectOneResponseBlockRunner;
//# sourceMappingURL=SelectOneResponseBlockRunner.js.map