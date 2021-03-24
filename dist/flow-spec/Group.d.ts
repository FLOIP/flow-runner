import { IContactGroup, IGroup } from '..';
export declare class Group implements IGroup {
    group_key: string;
    label?: string;
    constructor(group_key: string, label?: string);
    get __value__(): string;
}
export declare class ContactGroup extends Group implements IContactGroup {
    updated_at: string;
    deleted_at?: string;
    constructor(group: IGroup, updated_at?: string, deleted_at?: string, label?: string);
    constructor(group_key: string, updated_at?: string, deleted_at?: string, label?: string);
}
//# sourceMappingURL=Group.d.ts.map