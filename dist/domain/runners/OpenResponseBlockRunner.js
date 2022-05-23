"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenResponseBlockRunner = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
class OpenResponseBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize({ value }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const blockConfig = this.block.config;
            return {
                kind: __1.OPEN_PROMPT_KEY,
                prompt: blockConfig.prompt,
                isResponseRequired: true,
                value: value,
            };
        });
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                __1.setContactProperty(this.block, this.context);
                return __1.firstTrueOrNullBlockExitOrThrow(this.block, this.context);
            }
            catch (e) {
                console.error(e);
                return __1.findDefaultBlockExitOrThrow(this.block);
            }
        });
    }
}
exports.OpenResponseBlockRunner = OpenResponseBlockRunner;
//# sourceMappingURL=OpenResponseBlockRunner.js.map