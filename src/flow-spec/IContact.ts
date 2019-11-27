export default interface IContact {
  // the contact must have an ID
  id: string,

  // the contact can have any number of other properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any,
}
