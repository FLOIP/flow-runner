import {createFormattedDate, IContactGroup, IGroup, isGroup} from '..'

export class Group implements IGroup {
  constructor(public group_key: string, public label?: string) {}

  get __value__(): string {
    return this.group_key
  }
}

export class ContactGroup extends Group implements IContactGroup {
  updated_at: string
  deleted_at?: string | undefined

  constructor(group: IGroup)
  constructor(groupKey: string, label: string, updatedAt: string, deletedAt?: string)
  constructor(groupKey: string, updatedAt: string, deletedAt?: string)
  constructor(groupKeyOrGroup: string | IGroup, label?: string, updatedAt?: string, deletedAt?: string) {
    if (isGroup(groupKeyOrGroup)) {
      super(groupKeyOrGroup.group_key, groupKeyOrGroup.label)
      this.updated_at = createFormattedDate()
    } else {
      super(groupKeyOrGroup, label)
    }
    this.updated_at = updatedAt ?? createFormattedDate()
    if (deletedAt != null) {
      this.deleted_at = deletedAt
    }
  }
}
