"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintBlockRunner = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../index");
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
            this.console.log(this.block.type, index_1.evaluateToString(this.block.config.message, this.context));
            return this.block.exits[0];
        });
    }
}
exports.PrintBlockRunner = PrintBlockRunner;
//# sourceMappingURL=PrintBlockRunner.js.map