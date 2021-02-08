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
  constructor(group_key: string, label: string, updated_at: string, deleted_at?: string)
  constructor(group_key: string, updated_at: string, deleted_at?: string)
  constructor(groupKeyOrGroup: string | IGroup, label?: string, updated_at?: string, deleted_at?: string) {
    if (isGroup(groupKeyOrGroup)) {
      super(groupKeyOrGroup.group_key, groupKeyOrGroup.label)
      this.updated_at = createFormattedDate()
    } else {
      super(groupKeyOrGroup, label)
    }
    this.updated_at = updated_at ?? createFormattedDate()
    if (deleted_at != null) {
      this.deleted_at = deleted_at
    }
  }
}
