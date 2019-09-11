import NotImplementedException from '../domain/exceptions/NotImplementedException'

export default class {
  constructor(public val: number) {
  }

  toNumber(): number {
    return this.val
  }

  toString(): void {
    throw new NotImplementedException
  }
}