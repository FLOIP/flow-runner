import DeliveryStatus from './DeliveryStatus'

export default interface ISession {
  id: string,
  originFlowId: string | null, // ?
  originBlockInteractionId: string | null, // ?
  deliveryStatus: DeliveryStatus,
}