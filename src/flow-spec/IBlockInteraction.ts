// import UUID64 from "../model/UUID64";
// import UUID32 from "../model/UUID32";

export default interface IBlockInteraction {
  uuid: string//UUID64
  blockId: string//UUID32
  flowId: string//UUID32
  entryAt: Date // todo: should this instead be string?
  exitAt: Date | null // todo: should this instead be string?
  hasResponse: boolean
  value: string | number | null
  details: IBlockInteractionDetails // json (?) can we type this at all?
  type: null // (?) -- awaiting response from @george + @mark on this

  originBlockInteractionId: string | null //UUID64
  originFlowId: string | null //UUID64
}

export interface IBlockInteractionDetails {
  selectedExitId: string | null
}