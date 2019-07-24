
export default interface IBlockExit {
  uuid: string
  label: string // resource
  tag: string
  destination_block: string
  semantic_label?: string
  test?: string
  config: object
}
