"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
var OpenResponseBlockRunner = (function () {
    function OpenResponseBlockRunner(block, context) {
        this.block = block;
        this.context = context;
    }
    OpenResponseBlockRunner.prototype.initialize = function (_a) {
        var value = _a.value;
        var blockConfig = this.block.config;
        var maxResponseCharacters;
        if (blockConfig.text != null) {
            maxResponseCharacters = blockConfig.text.maxResponseCharacters;
        }
        return {
            kind: __1.KnownPrompts.Open,
            prompt: blockConfig.prompt,
            isResponseRequired: true,
            maxResponseCharacters: maxResponseCharacters,
            value: value,
        };
    };
    OpenResponseBlockRunner.prototype.run = function () {
        return this.block.exits[0];
    };
    return OpenResponseBlockRunner;
}());
exports.default = OpenResponseBlockRunner;
//# sourceMappingURL=OpenResponseBlockRunner.js.map