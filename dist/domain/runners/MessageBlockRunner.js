"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
var MessageBlockRunner = (function () {
    function MessageBlockRunner(block, context) {
        this.block = block;
        this.context = context;
    }
    MessageBlockRunner.prototype.initialize = function () {
        var prompt = this.block.config.prompt;
        return {
            kind: __1.KnownPrompts.Message,
            prompt: prompt,
            isResponseRequired: false,
        };
    };
    MessageBlockRunner.prototype.run = function () {
        return this.block.exits[0];
    };
    return MessageBlockRunner;
}());
exports.default = MessageBlockRunner;
//# sourceMappingURL=MessageBlockRunner.js.map