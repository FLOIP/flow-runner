"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const uuid_1 = tslib_1.__importDefault(require("uuid"));
class IdGeneratorUuidV4 {
    generate() {
        return uuid_1.default.v4();
    }
}
exports.IdGeneratorUuidV4 = IdGeneratorUuidV4;
exports.default = IdGeneratorUuidV4;
//# sourceMappingURL=IdGeneratorUuidV4.js.map