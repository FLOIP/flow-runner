import {IBlock, IBlockVendorMetadata, IBlockVendorMetadataFloip, IFloipUIMetadata, IGroupMembership, ISetGroupMembershipBlockConfig} from '../..'

export const SET_GROUP_MEMBERSHIP_BLOCK_TYPE = 'Core.SetGroupMembership'

export interface ISetGroupMembershipFloipUiMetadata extends IFloipUIMetadata {
  user_added_groups?: IGroupMembership[]
}

export interface ISetGroupMembershipVendorMetadataFloip extends IBlockVendorMetadataFloip {
  ui_metadata: ISetGroupMembershipFloipUiMetadata
}

export interface ISetGroupMembershipVendorMetadata extends IBlockVendorMetadata {
  floip: ISetGroupMembershipVendorMetadataFloip
}

export interface ISetGroupMembershipBlock extends IBlock<ISetGroupMembershipBlockConfig> {
  config: ISetGroupMembershipBlockConfig
  vendor_metadata?: ISetGroupMembershipVendorMetadata
}
