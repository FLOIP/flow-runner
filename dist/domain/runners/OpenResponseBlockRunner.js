"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class OpenResponseBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        const blockConfig = this.block.config;
        let maxResponseCharacters;
        if (blockConfig.text != null) {
            maxResponseCharacters = blockConfig.text.maxResponseCharacters;
        }
        return {
            kind: __1.KnownPrompts.Open,
            prompt: blockConfig.prompt,
            isResponseRequired: true,
            maxResponseCharacters: maxResponseCharacters,
        };
    }
    run() {
        return this.block.exits[0];
    }
}
exports.default = OpenResponseBlockRunner;
//# sourceMappingURL=OpenResponseBlockRunner.js.map