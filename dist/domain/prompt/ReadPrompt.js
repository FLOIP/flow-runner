"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const scanf_1 = tslib_1.__importDefault(require("scanf"));
const BasePrompt_1 = tslib_1.__importDefault(require("./BasePrompt"));
const ValidationException_1 = tslib_1.__importDefault(require("../exceptions/ValidationException"));
const __1 = require("../..");
class ReadPrompt extends BasePrompt_1.default {
    constructor(config, interactionId, runner, console = console) {
        super(config, interactionId, runner);
        this.config = config;
        this.interactionId = interactionId;
        this.runner = runner;
        this.console = console;
    }
    read() {
        try {
            this.console.log(this.config.prompt);
            const input = scanf_1.default(this.config.formatString);
            this.value = lodash_1.isArray(input) ? input : [input];
        }
        catch ({ message }) {
            this.value = lodash_1.fill(new Array(this.config.destinationVariables.length), null);
            this.error = new __1.PromptValidationException(message);
        }
    }
    validate(readValues) {
        const { destinationVariables } = this.config;
        if (readValues == null) {
            throw new ValidationException_1.default('Value provided must be a list of string|number');
        }
        if (readValues.length !== destinationVariables.length) {
            throw new ValidationException_1.default('Values provided must match length of destinationVariables');
        }
        return true;
    }
}
exports.ReadPrompt = ReadPrompt;
exports.default = ReadPrompt;
//# sourceMappingURL=ReadPrompt.js.map