import { IContactProperty } from '..';
export declare class ContactProperty implements IContactProperty {
    deleted_at: string | undefined;
    created_at: string;
    updated_at: string;
    __value__: string;
    constructor();
    get contact_property_field_name(): string;
    set contact_property_field_name(contactPropertyFieldName: string);
    get value(): string;
    set value(value: string);
}
export default ContactProperty;
//# sourceMappingURL=ContactProperty.d.ts.map