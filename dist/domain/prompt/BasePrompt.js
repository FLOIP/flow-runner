"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePrompt = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
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
            if (!(e instanceof __1.PromptValidationException)) {
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
        const intx = __1.findInteractionWith(this.interactionId, ctx);
        const flow = __1.findFlowWith(intx.flowId, ctx);
        try {
            return __1.findBlockWith(intx.blockId, flow);
        }
        catch (e) {
            if (!(e instanceof __1.ValidationException)) {
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
//# sourceMappingURL=BasePrompt.js.map