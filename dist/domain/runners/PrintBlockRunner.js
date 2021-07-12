"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintBlockRunner = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
class PrintBlockRunner {
    constructor(block, context, console = console) {
        this.block = block;
        this.context = context;
        this.console = console;
    }
    initialize() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                this.console.log(this.block.type, __1.evaluateToString(this.block.config.message, this.context));
            }
            catch (e) {
                console.error(e);
                return __1.findDefaultBlockExitOrThrow(this.block);
            }
            return __1.firstTrueBlockExitOrThrow(this.block, this.context);
        });
    }
}
exports.PrintBlockRunner = PrintBlockRunner;
//# sourceMappingURL=PrintBlockRunner.js.map