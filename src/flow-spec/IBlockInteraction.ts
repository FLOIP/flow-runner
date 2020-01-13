export interface IBlockInteraction {
  uuid: string // UUID64
  blockId: string // UUID32
  flowId: string // UUID32
  entryAt: string
  exitAt?: string
  hasResponse: boolean
  value?: string | number | object
  details: IBlockInteractionDetails
  selectedExitId: string | null
  type: string

  originBlockInteractionId?: string // UUID64
  originFlowId?: string // UUID64
}

export default IBlockInteraction

export interface IBlockInteractionDetails {
}