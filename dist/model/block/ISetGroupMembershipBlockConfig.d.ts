import { IBlockConfig } from '../..';
export interface IGroupMembership {
    group_key: string;
    group_name: string;
}
export interface ISetGroupMembershipBlockConfig extends IBlockConfig {
    clear?: boolean;
    is_member?: boolean;
    groups?: IGroupMembership[];
}
//# sourceMappingURL=ISetGroupMembershipBlockConfig.d.ts.map