"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const __1 = require("../..");
class OutputBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        return;
    }
    run(cursor) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            cursor.interaction.value = __1.evaluateToString(this.block.config.value, this.context);
            return this.block.exits[0];
        });
    }
}
exports.OutputBlockRunner = OutputBlockRunner;
exports.default = OutputBlockRunner;
//# sourceMappingURL=OutputBlockRunner.js.map