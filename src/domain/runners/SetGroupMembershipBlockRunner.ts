import {
  findDefaultBlockExitOrThrow,
  IBlockExit,
  IBlockRunner,
  IContext,
  IRichCursor,
  ISetGroupMembershipBlock,
  ValidationException,
} from '../..'

/**
 * Adds or removes a group from the contact.
 */
export class SetGroupMembershipBlockRunner implements IBlockRunner {
  constructor(public block: ISetGroupMembershipBlock, public context: IContext) {}

  async initialize(): Promise<undefined> {
    return undefined
  }

  async run(_cursor: IRichCursor): Promise<IBlockExit> {
    const group = this.context.groups.find(group => group.group_key === this.block.config.group_key)
    if (group == null) {
      throw new ValidationException(`Cannot add contact to non-existent group ${this.block.config.group_key}`)
    }
    if (this.block.config.is_member) {
      this.context.contact.addGroup(group)
    } else {
      this.context.contact.delGroup(group)
    }

    return findDefaultBlockExitOrThrow(this.block)
  }
}
