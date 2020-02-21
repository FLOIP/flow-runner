"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class PrintBlockRunner {
    constructor(block, context, console = console) {
        this.block = block;
        this.context = context;
        this.console = console;
    }
    initialize() {
        return;
    }
    run() {
        this.console.log(this.block.type, __1.evaluateToString(this.block.config.message, this.context));
        return this.block.exits[0];
    }
}
exports.PrintBlockRunner = PrintBlockRunner;
exports.default = PrintBlockRunner;
//# sourceMappingURL=PrintBlockRunner.js.map