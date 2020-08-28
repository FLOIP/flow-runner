"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactProperty = void 0;
const DateFormat_1 = require("../domain/DateFormat");
class ContactProperty {
    constructor() {
        this.createdAt = DateFormat_1.createFormattedDate();
        this.updatedAt = DateFormat_1.createFormattedDate();
    }
    get contactPropertyFieldName() {
        return this.contactPropertyFieldName;
    }
    set contactPropertyFieldName(contactPropertyFieldName) {
        this.contactPropertyFieldName = contactPropertyFieldName;
        this.updatedAt = DateFormat_1.createFormattedDate();
    }
    get value() {
        return this.__value__;
    }
    set value(value) {
        this.__value__ = value;
        this.updatedAt = DateFormat_1.createFormattedDate();
    }
}
exports.ContactProperty = ContactProperty;
exports.default = ContactProperty;
//# sourceMappingURL=ContactProperty.js.map