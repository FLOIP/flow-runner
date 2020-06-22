"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const PromptValidationException_1 = tslib_1.__importDefault(require("../exceptions/PromptValidationException"));
const IContext_1 = require("../../flow-spec/IContext");
const IFlow_1 = require("../../flow-spec/IFlow");
const ValidationException_1 = require("../../domain/exceptions/ValidationException");
class BasePrompt {
    constructor(config, interactionId, runner) {
        this.config = config;
        this.interactionId = interactionId;
        this.runner = runner;
        this.error = null;
    }
    get value() {
        return this.config.value;
    }
    set value(val) {
        try {
            this.validate(val);
        }
        catch (e) {
            if (!(e instanceof PromptValidationException_1.default)) {
                throw e;
            }
            this.error = e;
        }
        this.config.value = val;
    }
    get isEmpty() {
        return this.value === undefined;
    }
    get block() {
        const ctx = this.runner.context;
        const intx = IContext_1.findInteractionWith(this.interactionId, ctx);
        const flow = IContext_1.findFlowWith(intx.flowId, ctx);
        try {
            return IFlow_1.findBlockWith(intx.blockId, flow);
        }
        catch (e) {
            if (!(e instanceof ValidationException_1.ValidationException)) {
                throw e;
            }
            return;
        }
    }
    fulfill(val) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (val !== undefined) {
                this.value = val;
            }
            return this.runner.run();
        });
    }
    isValid() {
        try {
            return this.validate(this.config.value);
        }
        catch (e) {
            return false;
        }
    }
}
exports.BasePrompt = BasePrompt;
exports.default = BasePrompt;
//# sourceMappingURL=BasePrompt.js.map