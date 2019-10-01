// import UUID64 from "../model/UUID64";
// import UUID32 from "../model/UUID32";

export default interface IBlockInteraction {
  uuid: string // UUID64
  blockId: string // UUID32
  flowId: string // UUID32
  entryAt: string
  exitAt?: string
  hasResponse: boolean
  value?: string | number
  details: IBlockInteractionDetails // json (?) can we type this at all?
  type: string

  originBlockInteractionId?: string // UUID64
  originFlowId?: string // UUID64

  platformMetadata: object
}

export interface IBlockInteractionDetails {
  selectedExitId: string | null
}