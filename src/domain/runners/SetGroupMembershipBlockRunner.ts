import {evaluateToBool, IBlockExit, IContext, IRichCursor, ISetGroupMembershipBlock, IBlockRunner, ValidationException} from '../..'

const EXIT_SUCCESS = 0

/**
 * Adds or removes a group from the contact.
 */
export class SetGroupMembershipBlockRunner implements IBlockRunner {
  constructor(public block: ISetGroupMembershipBlock, public context: IContext) {}

  async initialize(): Promise<undefined> {
    return undefined
  }

  async run(_cursor: IRichCursor): Promise<IBlockExit> {
    const {exits} = this.block
    const {contact, groups} = this.context
    const {groupKey, isMember} = this.block.config

    const group = groups.find(group => group.groupKey === groupKey)

    if (group == null) {
      throw new ValidationException(`Cannot add contact to non-existent group ${groupKey}`)
    }

    if (evaluateToBool(isMember, this.context)) {
      contact.addGroup(group)
    } else {
      contact.delGroup(group)
    }

    return exits[EXIT_SUCCESS]
  }
}
