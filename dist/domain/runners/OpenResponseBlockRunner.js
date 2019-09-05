"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class OpenResponseBlockRunner {
    constructor(block, resources) {
        this.block = block;
        this.resources = resources;
    }
    initialize() {
        const { prompt, text: { maxResponseCharacters } } = this.block.config;
        return {
            kind: __1.KnownPrompts.Open,
            prompt: this.resources.resolve(prompt),
            isResponseRequired: true,
            maxResponseCharacters,
        };
    }
    run() {
        return this.block.exits[0];
    }
}
exports.default = OpenResponseBlockRunner;
//# sourceMappingURL=OpenResponseBlockRunner.js.map