"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const ValidationException_1 = tslib_1.__importDefault(require("../domain/exceptions/ValidationException"));
function findBlockWith(uuid, { blocks }) {
    const block = lodash_1.find(blocks, { uuid });
    if (block == null) {
        throw new ValidationException_1.default('Unable to find block on flow');
    }
    return block;
}
exports.findBlockWith = findBlockWith;
//# sourceMappingURL=IFlow.js.map