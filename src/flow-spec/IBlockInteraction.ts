export default interface IBlockInteraction {
  uuid: string // UUID64
  blockId: string // UUID32
  flowId: string // UUID32
  entryAt: string
  exitAt?: string
  hasResponse: boolean
  value?: string | number
  selectedExitId: string | null
  details: IBlockInteractionDetails // json (?) can we type this at all?
  type: string

  originBlockInteractionId?: string // UUID64
  originFlowId?: string // UUID64
}

export interface IBlockInteractionDetails {
}