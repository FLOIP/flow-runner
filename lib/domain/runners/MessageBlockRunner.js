"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IPrompt_1 = require("../prompt/IPrompt");
class MessageBlockRunner {
    constructor(block) {
        this.block = block;
    }
    initialize(interaction) {
        return {
            kind: IPrompt_1.KnownPrompts.Message,
            isResponseRequired: false,
            value: null,
        };
    }
    run(cursor) {
        return this.block.exits[0];
    }
}
exports.default = MessageBlockRunner;
//# sourceMappingURL=MessageBlockRunner.js.map