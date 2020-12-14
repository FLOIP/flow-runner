import { IContactGroup, IGroup } from '..';
export declare class Group implements IGroup {
    groupKey: string;
    label?: string | undefined;
    constructor(groupKey: string, label?: string | undefined);
    get __value__(): string;
}
export declare class ContactGroup extends Group implements IContactGroup {
    updatedAt: string;
    deletedAt?: string | undefined;
    constructor(group: IGroup);
    constructor(groupKey: string, label: string, updatedAt: string, deletedAt?: string);
    constructor(groupKey: string, updatedAt: string, deletedAt?: string);
}
//# sourceMappingURL=Group.d.ts.map