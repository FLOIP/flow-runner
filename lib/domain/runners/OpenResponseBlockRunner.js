"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IPrompt_1 = require("../prompt/IPrompt");
class OpenResponseBlockRunner {
    constructor(block) {
        this.block = block;
    }
    initialize() {
        return {
            kind: IPrompt_1.KnownPrompts.Open,
            isResponseRequired: true,
        };
    }
    run() {
        return this.block.exits[0];
    }
}
exports.default = OpenResponseBlockRunner;
//# sourceMappingURL=OpenResponseBlockRunner.js.map