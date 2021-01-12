declare type ContactPropertyResolver = (...args: string[]) => IContactProperty | undefined;
declare type ContactGroupResolver = (group: IGroup) => void;
export declare type IContactPropertyType = IContactProperty | ContactPropertyResolver | ContactGroupResolver | string | IContactGroup[] | undefined;
import { IContactProperty, IContactGroup, IGroup } from '..';
export interface IContact {
    id: IContactPropertyType;
    [key: string]: IContactPropertyType;
    groups: IContactGroup[];
    setProperty: (name: string, value?: string) => IContactProperty;
    getProperty: (name: string) => IContactProperty | undefined;
    addGroup: (group: IGroup) => void;
    delGroup: (group: IGroup) => void;
}
export {};
//# sourceMappingURL=IContact.d.ts.map