"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("../..");
const ResourceResolver_1 = tslib_1.__importDefault(require("../ResourceResolver"));
class OpenResponseBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        const { prompt, text: { maxResponseCharacters } } = this.block.config;
        return {
            kind: __1.KnownPrompts.Open,
            prompt: (new ResourceResolver_1.default(this.context)).resolve(prompt),
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