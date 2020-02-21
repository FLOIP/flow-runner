"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class OpenResponseBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize({ value }) {
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
            value: value,
        };
    }
    run() {
        return this.block.exits[0];
    }
}
exports.OpenResponseBlockRunner = OpenResponseBlockRunner;
exports.default = OpenResponseBlockRunner;
//# sourceMappingURL=OpenResponseBlockRunner.js.map