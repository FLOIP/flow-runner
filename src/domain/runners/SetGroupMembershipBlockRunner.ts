import {Group} from '../../flow-spec/Group'
import {evaluateToBool} from '../../flow-spec/IBlock'
import {IBlockExit} from '../../flow-spec/IBlockExit'
import {IContext, IRichCursor} from '../../flow-spec/IContext'
import {ISetGroupMembershipBlock} from '../../model/block/ISetGroupMembershipBlock'
import {IBlockRunner} from './IBlockRunner'

const EXIT_SUCCESS = 0

export class SetGroupMembershipBlockRunner implements IBlockRunner {
  constructor(public block: ISetGroupMembershipBlock, public context: IContext) {}

  async initialize(): Promise<undefined> {
    return undefined
  }

  async run(_cursor: IRichCursor): Promise<IBlockExit> {
    const {exits} = this.block
    const {contact, groups} = this.context
    const {groupKey, isMember} = this.block.config

    const group = groups.find(group => group.groupKey === groupKey) ?? new Group(groupKey)

    if (evaluateToBool(isMember, this.context)) {
      contact.addGroup(group)
    } else {
      contact.delGroup(group)
    }

    return exits[EXIT_SUCCESS]
  }
}
