import { IContact, IContactProperty } from '..';
export declare class Contact implements IContact {
    [key: string]: IContactProperty | ((...args: any[]) => IContactProperty | undefined) | string | undefined;
    id: string;
    constructor();
    setProperty(name: string, value: any): IContactProperty;
    getProperty(name: string): IContactProperty | undefined;
}
export default Contact;
//# sourceMappingURL=Contact.d.ts.map