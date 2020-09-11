"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBlockWith = void 0;
const index_1 = require("../index");
const lodash_1 = require("lodash");
function findBlockWith(uuid, { blocks }) {
    const block = lodash_1.find(blocks, { uuid });
    if (block == null) {
        throw new index_1.ValidationException('Unable to find block on flow');
    }
    return block;
}
exports.findBlockWith = findBlockWith;
//# sourceMappingURL=IFlow.js.map