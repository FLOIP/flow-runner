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
    constructor(groupKeyOrGroup, updated_at = __1.createFormattedDate(), deleted_at, label) {
        if (__1.isGroup(groupKeyOrGroup)) {
            super(groupKeyOrGroup.group_key, groupKeyOrGroup.label);
        }
        else {
            super(groupKeyOrGroup, label);
        }
        this.updated_at = updated_at;
        if (deleted_at != null) {
            this.deleted_at = deleted_at;
        }
    }
}
exports.ContactGroup = ContactGroup;
//# sourceMappingURL=Group.js.map