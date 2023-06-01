import { IBlock, IBlockVendorMetadata, IBlockVendorMetadataFloip, IFloipUIMetadata, ISetGroupMembershipBlockConfig } from '../..';
export declare const SET_GROUP_MEMBERSHIP_BLOCK_TYPE = "Core.SetGroupMembership";
export interface ISetGroupMembershipFloipUiMetadata extends IFloipUIMetadata {
    user_added_groups?: string[];
}
export interface ISetGroupMembershipVendorMetadataFloip extends IBlockVendorMetadataFloip {
    ui_metadata: ISetGroupMembershipFloipUiMetadata;
}
export interface ISetGroupMembershipVendorMetadata extends IBlockVendorMetadata {
    floip: ISetGroupMembershipVendorMetadataFloip;
}
export interface ISetGroupMembershipBlock extends IBlock<ISetGroupMembershipBlockConfig> {
    config: ISetGroupMembershipBlockConfig;
    vendor_metadata?: ISetGroupMembershipVendorMetadata;
}
//# sourceMappingURL=ISetGroupMembershipBlock.d.ts.map