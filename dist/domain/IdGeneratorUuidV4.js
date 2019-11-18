"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var uuid_1 = tslib_1.__importDefault(require("uuid"));
var IdGeneratorUuidV4 = (function () {
    function IdGeneratorUuidV4() {
    }
    IdGeneratorUuidV4.prototype.generate = function () {
        return uuid_1.default.v4();
    };
    return IdGeneratorUuidV4;
}());
exports.default = IdGeneratorUuidV4;
//# sourceMappingURL=IdGeneratorUuidV4.js.map