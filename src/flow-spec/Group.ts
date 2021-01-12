import {createFormattedDate, IContactGroup, IGroup, isGroup} from '..'

export class Group implements IGroup {
  constructor(public groupKey: string, public label?: string) {}

  get __value__(): string {
    return this.groupKey
  }
}

export class ContactGroup extends Group implements IContactGroup {
  updatedAt: string
  deletedAt?: string | undefined

  constructor(group: IGroup)
  constructor(groupKey: string, label: string, updatedAt: string, deletedAt?: string)
  constructor(groupKey: string, updatedAt: string, deletedAt?: string)
  constructor(groupKeyOrGroup: string | IGroup, label?: string, updatedAt?: string, deletedAt?: string) {
    if (isGroup(groupKeyOrGroup)) {
      super(groupKeyOrGroup.groupKey, groupKeyOrGroup.label)
      this.updatedAt = createFormattedDate()
    } else {
      super(groupKeyOrGroup, label)
    }
    this.updatedAt = updatedAt ?? createFormattedDate()
    if (deletedAt != null) {
      this.deletedAt = deletedAt
    }
  }
}
