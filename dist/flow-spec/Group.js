"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactGroup = exports.Group = void 0;
const __1 = require("..");
class Group {
    constructor(groupKey, label) {
        this.groupKey = groupKey;
        this.label = label;
    }
    get __value__() {
        return this.groupKey;
    }
}
exports.Group = Group;
class ContactGroup extends Group {
    constructor(groupKeyOrGroup, label, updatedAt, deletedAt) {
        if (__1.isGroup(groupKeyOrGroup)) {
            super(groupKeyOrGroup.groupKey, groupKeyOrGroup.label);
            this.updatedAt = __1.createFormattedDate();
        }
        else {
            super(groupKeyOrGroup, label);
        }
        this.updatedAt = updatedAt !== null && updatedAt !== void 0 ? updatedAt : __1.createFormattedDate();
        if (deletedAt != null) {
            this.deletedAt = deletedAt;
        }
    }
}
exports.ContactGroup = ContactGroup;
//# sourceMappingURL=Group.js.map