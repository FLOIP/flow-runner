"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IPrompt_1 = require("../prompt/IPrompt");
class SelectOneResponseBlockRunner {
    constructor(block) {
        this.block = block;
    }
    initialize(interaction) {
        return {
            kind: IPrompt_1.KnownPrompts.SelectOne,
            choices: Array.from(this.block.config.choices.keys()),
            isResponseRequired: true,
            value: null,
        };
    }
    run(cursor) {
        return this.block.exits[0];
    }
}
exports.default = SelectOneResponseBlockRunner;
//# sourceMappingURL=SelectOneResponseBlockRunner.js.map