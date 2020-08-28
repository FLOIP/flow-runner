"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBlockRunner = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
class MessageBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prompt } = this.block.config;
            return {
                kind: __1.MESSAGE_PROMPT_KEY,
                prompt,
                isResponseRequired: false,
            };
        });
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.block.exits[0];
        });
    }
}
exports.MessageBlockRunner = MessageBlockRunner;
//# sourceMappingURL=MessageBlockRunner.js.map