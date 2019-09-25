import IContext, {CursorType} from './IContext'
import IFlow from './IFlow'
import IContact from './IContact'
import DeliveryStatus from './DeliveryStatus'
import IBlockInteraction from './IBlockInteraction'
import {IResource, IResources, SupportedMode} from '..'
import ResourceResolver from '../domain/ResourceResolver'

export default class Context implements IContext {
  constructor(
    public contact: IContact,
    public createdAt: Date,
    public cursor: CursorType,
    public deliveryStatus: DeliveryStatus,
    public entryAt: Date,
    public exitAt: Date,
    public firstFlowId: string,
    public flows: IFlow[],
    public id: string,
    public interactions: IBlockInteraction[],
    public languageId: string,
    public mode: SupportedMode,
    public nestedFlowBlockInteractionIdStack: string[],
    public resources: IResources,
    public sessionVars: object,
    public userId: string) {}

  getResource(resourceId: string): IResource {
    return new ResourceResolver(this)
      .resolve(resourceId)
  }
}
