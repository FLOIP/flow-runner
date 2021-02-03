import { IContactGroup, IGroup } from '..';
export declare class Group implements IGroup {
    group_key: string;
    label?: string | undefined;
    constructor(group_key: string, label?: string | undefined);
    get __value__(): string;
}
export declare class ContactGroup extends Group implements IContactGroup {
    updated_at: string;
    deleted_at?: string | undefined;
    constructor(group: IGroup);
    constructor(groupKey: string, label: string, updatedAt: string, deletedAt?: string);
    constructor(groupKey: string, updatedAt: string, deletedAt?: string);
}
//# sourceMappingURL=Group.d.ts.map