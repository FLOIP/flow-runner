import {IBlockConfig} from '../..'

export interface IGroupMembership {
  group_key: string
  group_name: string
}

/**
 * Adding or removing contact from group(s)
 */
export interface ISetGroupMembershipBlockConfig extends IBlockConfig {
  /**
   * When `clear` is present and set `true`, this will remove the contact
   * from all groups. In this case, the other fields, i.e., `is_member`
   * and `groups` will be ignored.
   */
  clear?: boolean
  is_member?: boolean
  groups?: IGroupMembership[]
}
