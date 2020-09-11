"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputBlockRunner = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../index");
class OutputBlockRunner {
    constructor(block, context) {
        this.block = block;
        this.context = context;
    }
    initialize() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    run(cursor) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            cursor.interaction.value = index_1.evaluateToString(this.block.config.value, this.context);
            return this.block.exits[0];
        });
    }
}
exports.OutputBlockRunner = OutputBlockRunner;
//# sourceMappingURL=OutputBlockRunner.js.map