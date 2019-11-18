"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var ValidationException_1 = tslib_1.__importDefault(require("../domain/exceptions/ValidationException"));
function findBlockWith(uuid, _a) {
    var blocks = _a.blocks;
    var block = lodash_1.find(blocks, { uuid: uuid });
    if (block == null) {
        throw new ValidationException_1.default('Unable to find block on flow');
    }
    return block;
}
exports.findBlockWith = findBlockWith;
//# sourceMappingURL=IFlow.js.map