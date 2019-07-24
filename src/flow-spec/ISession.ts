
export default interface ISession {
  id: string
  originFlowId: string | null // ?
  originBlockInteractionId: string | null // ?
  deliveryStatus: 'IN_PROGRESS' | 'FINISHED_INCOMPLETE' | 'FINISHED_COMPLETE'
}