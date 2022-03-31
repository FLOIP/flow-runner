"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectManyResponseBlockRunner = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
class SelectManyResponseBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize({ value }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prompt, choices } = this.block.config;
            return {
                kind: __1.SELECT_MANY_PROMPT_KEY,
                prompt,
                isResponseRequired: true,
                choices: Object.keys(choices).map(key => ({
                    key,
                    value: choices[key],
                })),
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
exports.SelectManyResponseBlockRunner = SelectManyResponseBlockRunner;
//# sourceMappingURL=SelectManyResponseBlockRunner.js.map