"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PromptValidationException_1 = tslib_1.__importDefault(require("../exceptions/PromptValidationException"));
var BasePrompt = (function () {
    function BasePrompt(config, interactionId, runner) {
        this.config = config;
        this.interactionId = interactionId;
        this.runner = runner;
        this.error = null;
        this.isValid = false;
    }
    Object.defineProperty(BasePrompt.prototype, "value", {
        get: function () {
            return this.config.value;
        },
        set: function (val) {
            try {
                this.isValid = this.validate(val);
            }
            catch (e) {
                if (!(e instanceof PromptValidationException_1.default)) {
                    throw e;
                }
                this.error = e;
            }
            this.config.value = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasePrompt.prototype, "isEmpty", {
        get: function () {
            return this.value === undefined;
        },
        enumerable: true,
        configurable: true
    });
    BasePrompt.prototype.fulfill = function (val) {
        this.value = val;
        return this.runner.run();
    };
    return BasePrompt;
}());
exports.default = BasePrompt;
//# sourceMappingURL=BasePrompt.js.map