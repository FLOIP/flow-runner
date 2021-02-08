"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactProperty = void 0;
const DateFormat_1 = require("../domain/DateFormat");
class ContactProperty {
    constructor() {
        this.created_at = DateFormat_1.createFormattedDate();
        this.updated_at = DateFormat_1.createFormattedDate();
    }
    get contact_property_field_name() {
        return this.contact_property_field_name;
    }
    set contact_property_field_name(contactPropertyFieldName) {
        this.contact_property_field_name = contactPropertyFieldName;
        this.updated_at = DateFormat_1.createFormattedDate();
    }
    get value() {
        return this.__value__;
    }
    set value(value) {
        this.__value__ = value;
        this.updated_at = DateFormat_1.createFormattedDate();
    }
}
exports.ContactProperty = ContactProperty;
exports.default = ContactProperty;
//# sourceMappingURL=ContactProperty.js.map