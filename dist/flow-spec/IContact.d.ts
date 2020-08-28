import { IContactProperty } from '..';
export interface IContact {
    id: IContactProperty | ((...args: string[]) => IContactProperty | undefined) | string | undefined;
    [key: string]: IContactProperty | ((...args: string[]) => IContactProperty | undefined) | string | undefined;
    setProperty: (name: string, value?: string) => IContactProperty;
    getProperty: (name: string) => IContactProperty | undefined;
}
//# sourceMappingURL=IContact.d.ts.map