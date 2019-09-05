"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class MessageBlockRunner {
    constructor(block, resources) {
        this.block = block;
        this.resources = resources;
    }
    initialize() {
        const { prompt } = this.block.config;
        return {
            kind: __1.KnownPrompts.Message,
            prompt: this.resources.resolve(prompt),
            isResponseRequired: false,
        };
    }
    run() {
        return this.block.exits[0];
    }
}
exports.default = MessageBlockRunner;
//# sourceMappingURL=MessageBlockRunner.js.map