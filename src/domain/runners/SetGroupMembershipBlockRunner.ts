import {
  assertNotNull,
  findDefaultBlockExitOrThrow,
  firstTrueOrNullBlockExitOrThrow,
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
    try {
      const group = this.context.groups.find(group => group.group_key === this.block.config.group_key)
      assertNotNull(
        group,
        () => `Cannot add contact to non-existent group ${this.block.config.group_key}`,
        errorMessage => new ValidationException(errorMessage)
      )

      if (this.block.config.is_member) {
        this.context.contact.addGroup(group)
      } else {
        this.context.contact.delGroup(group)
      }

      return firstTrueOrNullBlockExitOrThrow(this.block, this.context)
    } catch (e) {
      console.error(e)
      return findDefaultBlockExitOrThrow(this.block)
    }
  }
}
