"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStaticFirstExitBlockRunnerFor = void 0;
const tslib_1 = require("tslib");
function createStaticFirstExitBlockRunnerFor(block, context) {
    return {
        block,
        context,
        initialize: () => tslib_1.__awaiter(this, void 0, void 0, function* () { return undefined; }),
        run: () => tslib_1.__awaiter(this, void 0, void 0, function* () { return block.exits[0]; }),
    };
}
exports.createStaticFirstExitBlockRunnerFor = createStaticFirstExitBlockRunnerFor;
//# sourceMappingURL=BlockRunner.js.map