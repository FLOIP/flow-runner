"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const __1 = require("..");
class Contact {
    constructor() {
        this.groups = [];
    }
    setProperty(name, value) {
        const prop = {
            __value__: value,
            value: value,
            contactPropertyFieldName: name,
            createdAt: __1.createFormattedDate(),
            updatedAt: __1.createFormattedDate(),
            deletedAt: undefined,
        };
        this[name] = prop;
        return prop;
    }
    getProperty(name) {
        if (this[name] == null) {
            return undefined;
        }
        return this[name];
    }
    addGroup(newGroup) {
        var _a;
        (_a = this.groups.find(group => group.groupKey === newGroup.groupKey)) !== null && _a !== void 0 ? _a : this.groups.push(new __1.ContactGroup(newGroup));
    }
    delGroup(toRemove) {
        const group = this.groups.find(group => group.groupKey === toRemove.groupKey);
        if (group) {
            group.deletedAt = __1.createFormattedDate();
        }
    }
}
exports.Contact = Contact;
exports.default = Contact;
//# sourceMappingURL=Contact.js.map