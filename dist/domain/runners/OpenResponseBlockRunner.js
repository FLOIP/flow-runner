"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class OpenResponseBlockRunner {
    constructor(block) {
        this.block = block;
    }
    initialize() {
        return {
            kind: __1.KnownPrompts.Open,
            prompt: this.block.config.prompt,
            isResponseRequired: true,
            maxResponseCharacters: this.block.config.text.maxResponseCharacters,
        };
    }
    run() {
        return this.block.exits[0];
    }
}
exports.default = OpenResponseBlockRunner;
//# sourceMappingURL=OpenResponseBlockRunner.js.map