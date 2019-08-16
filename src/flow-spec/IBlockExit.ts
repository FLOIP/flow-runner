
export default interface IBlockExit {
  uuid: string,
  label: string, // resource
  tag: string,
  destinationBlock?: string,
  semanticLabel?: string,
  test?: string,
  config: object,
}