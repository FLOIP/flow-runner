import {IBlockConfig} from '../..'

export interface IGroupMembership {
  group_key: string
  group_name: string
}

/**
 * Adding or removing contact from group(s)
 */
export interface IAddOrRemoveGroupMembership extends IBlockConfig {
  is_member: boolean
  groups: IGroupMembership[]
}

/**
 * Removing contact from all groups
 */
export interface IClearGroupMembership extends IBlockConfig {
  clear: true
}

export type ISetGroupMembershipBlockConfig = IAddOrRemoveGroupMembership | IClearGroupMembership
