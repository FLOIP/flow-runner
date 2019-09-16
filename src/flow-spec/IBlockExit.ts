
export default interface IBlockExit {
  uuid: string
  label: string // resource
  tag: string
  destinationBlock?: string
  semanticLabel?: string
  test?: string
  config: object
  // todo: should we rename this to isDefault to capture boolean type?
  // todo: we need to update docs -- they specify "key presence", but I'd prefer us to be more explicit
  default?: boolean
}

export interface IBlockExitTestRequired extends IBlockExit {
  test: string
}