"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGroup = void 0;
function isGroup(thing) {
    return typeof thing === 'object' && thing !== null && 'group_key' in thing && '__value__' in thing;
}
exports.isGroup = isGroup;
//# sourceMappingURL=IGroup.js.map