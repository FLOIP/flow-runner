import {createFormattedDate, IContactGroup, IGroup, isGroup} from '..'

export class Group implements IGroup {
  group_key: string
  label?: string

  constructor(group_key: string, label?: string) {
    this.group_key = group_key
    this.label = label
  }

  get __value__(): string {
    return this.group_key
  }
}

export class ContactGroup extends Group implements IContactGroup {
  updated_at: string
  deleted_at?: string

  constructor(group: IGroup, updated_at?: string, deleted_at?: string, label?: string)
  constructor(group_key: string, updated_at?: string, deleted_at?: string, label?: string)
  constructor(groupKeyOrGroup: string | IGroup, updated_at: string = createFormattedDate(), deleted_at?: string, label?: string) {
    if (isGroup(groupKeyOrGroup)) {
      super(groupKeyOrGroup.group_key, groupKeyOrGroup.label)
    } else {
      super(groupKeyOrGroup, label)
    }
    this.updated_at = updated_at
    if (deleted_at != null) {
      this.deleted_at = deleted_at
    }
  }
}
