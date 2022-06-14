import { IBlockConfig } from '../..';
export interface IGroupMembership {
    group_key: string;
    group_name: string;
}
export interface IAddOrRemoveGroupMembership extends IBlockConfig {
    is_member: boolean;
    groups: IGroupMembership[];
}
export interface IClearGroupMembership extends IBlockConfig {
    clear: true;
}
export declare type ISetGroupMembershipBlockConfig = IAddOrRemoveGroupMembership | IClearGroupMembership;
//# sourceMappingURL=ISetGroupMembershipBlockConfig.d.ts.map