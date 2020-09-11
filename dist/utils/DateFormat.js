"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFormattedDate = void 0;
function createFormattedDate(date = new Date()) {
    return date.toISOString().replace('T', ' ');
}
exports.createFormattedDate = createFormattedDate;
//# sourceMappingURL=DateFormat.js.map