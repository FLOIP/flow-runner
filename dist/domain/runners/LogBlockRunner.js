"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogBlockRunner = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
const DateFormat_1 = require("../DateFormat");
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
            try {
                this.context.logs[DateFormat_1.createFormattedDate()] = __1.evaluateToString(this.block.config.message, this.context);
            }
            catch (e) {
                console.error(e);
                return __1.findDefaultBlockExitOrThrow(this.block);
            }
            return __1.firstTrueBlockExitOrThrow(this.block, this.context);
        });
    }
}
exports.LogBlockRunner = LogBlockRunner;
//# sourceMappingURL=LogBlockRunner.js.map