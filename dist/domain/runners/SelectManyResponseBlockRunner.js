"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
var lodash_1 = require("lodash");
var SelectManyResponseBlockRunner = (function () {
    function SelectManyResponseBlockRunner(block, context) {
        this.block = block;
        this.context = context;
    }
    SelectManyResponseBlockRunner.prototype.initialize = function (_a) {
        var value = _a.value;
        var _b = this.block.config, prompt = _b.prompt, choices = _b.choices;
        return {
            kind: __1.KnownPrompts.SelectMany,
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
    SelectManyResponseBlockRunner.prototype.run = function () {
        var truthyExit = __1.findFirstTruthyEvaluatingBlockExitOn(this.block, this.context);
        return (truthyExit != null
            ? truthyExit
            : lodash_1.last(this.block.exits));
    };
    return SelectManyResponseBlockRunner;
}());
exports.default = SelectManyResponseBlockRunner;
//# sourceMappingURL=SelectManyResponseBlockRunner.js.map