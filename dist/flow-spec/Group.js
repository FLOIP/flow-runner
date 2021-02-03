"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactGroup = exports.Group = void 0;
const __1 = require("..");
class Group {
    constructor(group_key, label) {
        this.group_key = group_key;
        this.label = label;
    }
    get __value__() {
        return this.group_key;
    }
}
exports.Group = Group;
class ContactGroup extends Group {
    constructor(groupKeyOrGroup, label, updatedAt, deletedAt) {
        if (__1.isGroup(groupKeyOrGroup)) {
            super(groupKeyOrGroup.group_key, groupKeyOrGroup.label);
            this.updated_at = __1.createFormattedDate();
        }
        else {
            super(groupKeyOrGroup, label);
        }
        this.updated_at = updatedAt !== null && updatedAt !== void 0 ? updatedAt : __1.createFormattedDate();
        if (deletedAt != null) {
            this.deleted_at = deletedAt;
        }
    }
}
exports.ContactGroup = ContactGroup;
//# sourceMappingURL=Group.js.map