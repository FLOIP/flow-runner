import {IBlock} from '../..'
import {ISetGroupMembershipBlockConfig} from './ISetGroupMembershipBlockConfig'

export const SET_GROUP_MEMBERSHIP_BLOCK_TYPE = 'Core.SetGroupMembership'

export interface ISetGroupMembershipBlock extends IBlock<ISetGroupMembershipBlockConfig> {
  config: ISetGroupMembershipBlockConfig
}
