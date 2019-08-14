"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IPrompt_1 = require("../prompt/IPrompt");
class NumericResponseBlockRunner {
    constructor(block) {
        this.block = block;
    }
    initialize(interaction) {
        return {
            kind: IPrompt_1.KnownPrompts.Numeric,
            maxLength: 0,
            min: this.block.config["validation-minimum"],
            max: this.block.config['validation-maximum'],
            isResponseRequired: false,
            value: null,
        };
    }
    run(cursor) {
        return this.block.exits[0];
    }
}
exports.default = NumericResponseBlockRunner;
//# sourceMappingURL=NumericResponseBlockRunner.js.map