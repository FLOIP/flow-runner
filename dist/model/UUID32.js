"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const NotImplementedException_1 = tslib_1.__importDefault(require("../domain/exceptions/NotImplementedException"));
class default_1 {
    constructor(val) {
        this.val = val;
    }
    toNumber() {
        return this.val;
    }
    toString() {
        throw new NotImplementedException_1.default;
    }
}
exports.default = default_1;
//# sourceMappingURL=UUID32.js.map