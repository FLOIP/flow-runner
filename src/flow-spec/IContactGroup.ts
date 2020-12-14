import {IGroup} from '..'

export interface IContactGroup extends IGroup {
  updatedAt: string
  deletedAt?: string
}
