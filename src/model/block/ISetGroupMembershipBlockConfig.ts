import {IBlockConfig} from '../..'

export interface ISetGroupMembershipBlockConfig extends IBlockConfig {
  /**
   * An identifier for the group that membership will be set within.
   */
  group_key: string
  /**
   * A human-readable label in addition to the group_key, in cases where the group_name needs to be displayed to the Contact.
   */
  group_name?: string
  /**
   * Determines the membership state:
   * - falsy to remove the contact from the group,
   * - truthy to add,
   * - and null for no change to the existing membership.
   *
   * Its type is string because it may contain expressions too.
   *
   * @format floip-expression
   */
  is_member: string
}
