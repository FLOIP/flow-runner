import { IContact, IContactProperty, IContactPropertyType, IContactGroup, IGroup } from '..';
export declare class Contact implements IContact {
    [key: string]: IContactPropertyType;
    id: string;
    groups: IContactGroup[];
    constructor();
    setProperty(name: string, value: any): IContactProperty;
    getProperty(name: string): IContactProperty | undefined;
    addGroup(newGroup: IGroup): void;
    delGroup(toRemove: IGroup): void;
}
export default Contact;
//# sourceMappingURL=Contact.d.ts.map