"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogBlockRunner = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../index");
class LogBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.context.logs[index_1.createFormattedDate()] = index_1.evaluateToString(this.block.config.message, this.context);
            return this.block.exits[0];
        });
    }
}
exports.LogBlockRunner = LogBlockRunner;
//# sourceMappingURL=LogBlockRunner.js.map