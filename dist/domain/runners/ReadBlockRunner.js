"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const __1 = require("../..");
class ReadBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        const { destinationVariables, formatString } = this.block.config;
        return {
            kind: __1.KnownPrompts.Read,
            prompt: `Requesting  ${JSON.stringify(destinationVariables)}`,
            destinationVariables,
            formatString,
            isResponseRequired: false,
        };
    }
    run({ interaction, prompt }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            interaction.value = lodash_1.zipObject(this.block.config.destinationVariables, prompt.value);
            const { error } = prompt;
            if (error != null) {
                interaction.details.readError = { message: error.message };
            }
            return prompt.isValid
                ? this.block.exits[0]
                : this.block.exits[1];
        });
    }
}
exports.ReadBlockRunner = ReadBlockRunner;
exports.default = ReadBlockRunner;
//# sourceMappingURL=ReadBlockRunner.js.map