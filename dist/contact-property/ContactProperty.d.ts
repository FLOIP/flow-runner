import { IContactProperty } from '../index';
export declare class ContactProperty implements IContactProperty {
    deletedAt: string | undefined;
    createdAt: string;
    updatedAt: string;
    __value__: string;
    constructor();
    get contactPropertyFieldName(): string;
    set contactPropertyFieldName(contactPropertyFieldName: string);
    get value(): string;
    set value(value: string);
}
export default ContactProperty;
//# sourceMappingURL=ContactProperty.d.ts.map