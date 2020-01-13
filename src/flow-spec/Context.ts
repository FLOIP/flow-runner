import IContext, {TCursor, IReversibleUpdateOperation} from './IContext'
import IFlow from './IFlow'
import IContact from './IContact'
import DeliveryStatus from './DeliveryStatus'
import IBlockInteraction from './IBlockInteraction'
import {IResource, IResources, SupportedMode} from '..'
import ResourceResolver from '../domain/ResourceResolver'

export class Context implements IContext {
  constructor(
    public id: string,
    public createdAt: string,
    public deliveryStatus: DeliveryStatus,

    public mode: SupportedMode,
    public languageId: string,

    public contact: IContact,
    public sessionVars: any,
    public interactions: IBlockInteraction[],
    public nestedFlowBlockInteractionIdStack: string[],
    public reversibleOperations: IReversibleUpdateOperation[],

    public flows: IFlow[],
    public firstFlowId: string,
    public resources: IResources,

    public entryAt?: string,
    public exitAt?: string,
    public userId?: string,
    public orgId?: string,
    public cursor?: TCursor,
    public platformMetadata: object = {},

    public logs: any = {}
  ) {}

  getResource(resourceId: string): IResource {
    return new ResourceResolver(this)
      .resolve(resourceId)
  }
}

export default Context