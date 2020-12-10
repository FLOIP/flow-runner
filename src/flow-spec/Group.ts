import {IGroup} from './IGroup'

export class Group implements IGroup {
  constructor(public groupKey: string, public label?: string) {}

  get __value__(): string {
    return this.groupKey
  }
}
