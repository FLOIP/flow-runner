import {IBlockConfig} from './IBlockConfig'

export interface ISetGroupMembershipBlockConfig extends IBlockConfig {
  group_key: string
  group_name?: string
  is_member: boolean
}
