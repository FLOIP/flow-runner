import {IBlock, ISetGroupMembershipBlockConfig} from '../..'

export const SET_GROUP_MEMBERSHIP_BLOCK_TYPE = 'Core.SetGroupMembership'

export interface ISetGroupMembershipBlock extends IBlock<ISetGroupMembershipBlockConfig> {
  type: 'Core.SetGroupMembership'
  config: ISetGroupMembershipBlockConfig
}
