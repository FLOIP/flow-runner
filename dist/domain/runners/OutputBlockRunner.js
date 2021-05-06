"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputBlockRunner = void 0;
const tslib_1 = require("tslib");
const __1 = require("../..");
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
            cursor.interaction.value = __1.evaluateToString(this.block.config.value, __1.createEvalContextFrom(this.context));
            cursor.interaction.has_response = true;
            __1.setContactProperty(this.block, this.context);
            return this.block.exits[0];
        });
    }
}
exports.OutputBlockRunner = OutputBlockRunner;
//# sourceMappingURL=OutputBlockRunner.js.map