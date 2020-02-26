"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("../..");
class MessageBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        const { prompt } = this.block.config;
        return {
            kind: __1.KnownPrompts.Message,
            prompt,
            isResponseRequired: false,
        };
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.block.exits[0];
        });
    }
}
exports.MessageBlockRunner = MessageBlockRunner;
exports.default = MessageBlockRunner;
//# sourceMappingURL=MessageBlockRunner.js.map