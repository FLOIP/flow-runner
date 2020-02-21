"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createFormattedDate(d = new Date) {
    return d.toISOString()
        .replace('T', ' ');
}
exports.createFormattedDate = createFormattedDate;
exports.default = createFormattedDate;
//# sourceMappingURL=DateFormat.js.map