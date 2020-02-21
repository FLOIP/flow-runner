import IContext, { ICursor, IReversibleUpdateOperation } from './IContext';
import IFlow from './IFlow';
import IContact from './IContact';
import DeliveryStatus from './DeliveryStatus';
import IBlockInteraction from './IBlockInteraction';
import { IResource, IResources, SupportedMode } from '..';
export declare class Context implements IContext {
    id: string;
    createdAt: string;
    deliveryStatus: DeliveryStatus;
    mode: SupportedMode;
    languageId: string;
    contact: IContact;
    sessionVars: any;
    interactions: IBlockInteraction[];
    nestedFlowBlockInteractionIdStack: string[];
    reversibleOperations: IReversibleUpdateOperation[];
    flows: IFlow[];
    firstFlowId: string;
    resources: IResources;
    entryAt?: string | undefined;
    exitAt?: string | undefined;
    userId?: string | undefined;
    orgId?: string | undefined;
    cursor?: ICursor | undefined;
    platformMetadata: object;
    logs: any;
    constructor(id: string, createdAt: string, deliveryStatus: DeliveryStatus, mode: SupportedMode, languageId: string, contact: IContact, sessionVars: any, interactions: IBlockInteraction[], nestedFlowBlockInteractionIdStack: string[], reversibleOperations: IReversibleUpdateOperation[], flows: IFlow[], firstFlowId: string, resources: IResources, entryAt?: string | undefined, exitAt?: string | undefined, userId?: string | undefined, orgId?: string | undefined, cursor?: ICursor | undefined, platformMetadata?: object, logs?: any);
    getResource(resourceId: string): IResource;
}
export default Context;
//# sourceMappingURL=Context.d.ts.map