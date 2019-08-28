"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class MessageBlockRunner {
    constructor(block) {
        this.block = block;
    }
    initialize() {
        return {
            kind: __1.KnownPrompts.Message,
            prompt: this.block.config.prompt,
            isResponseRequired: false,
        };
    }
    run() {
        return this.block.exits[0];
    }
}
exports.default = MessageBlockRunner;
//# sourceMappingURL=MessageBlockRunner.js.map