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
            contact_property_field_name: name,
            created_at: __1.createFormattedDate(),
            updated_at: __1.createFormattedDate(),
            deleted_at: undefined,
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
        (_a = this.groups.find(group => group.group_key === newGroup.group_key)) !== null && _a !== void 0 ? _a : this.groups.push(new __1.ContactGroup(newGroup));
    }
    delGroup(toRemove) {
        const group = this.groups.find(group => group.group_key === toRemove.group_key);
        if (group) {
            group.deleted_at = __1.createFormattedDate();
        }
    }
}
exports.Contact = Contact;
exports.default = Contact;
//# sourceMappingURL=Contact.js.map