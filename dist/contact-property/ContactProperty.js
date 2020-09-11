"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactProperty = void 0;
const index_1 = require("../index");
class ContactProperty {
    constructor() {
        this.createdAt = index_1.createFormattedDate();
        this.updatedAt = index_1.createFormattedDate();
    }
    get contactPropertyFieldName() {
        return this.contactPropertyFieldName;
    }
    set contactPropertyFieldName(contactPropertyFieldName) {
        this.contactPropertyFieldName = contactPropertyFieldName;
        this.updatedAt = index_1.createFormattedDate();
    }
    get value() {
        return this.__value__;
    }
    set value(value) {
        this.__value__ = value;
        this.updatedAt = index_1.createFormattedDate();
    }
}
exports.ContactProperty = ContactProperty;
exports.default = ContactProperty;
//# sourceMappingURL=ContactProperty.js.map