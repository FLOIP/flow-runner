import IContext, { CursorType } from './IContext';
import IFlow from './IFlow';
import IContact from './IContact';
import DeliveryStatus from './DeliveryStatus';
import IBlockInteraction from './IBlockInteraction';
import { IResource, IResources, SupportedMode } from '..';
export default class Context implements IContext {
    contact: IContact;
    createdAt: string;
    cursor: CursorType;
    deliveryStatus: DeliveryStatus;
    entryAt: string;
    exitAt: string;
    firstFlowId: string;
    flows: IFlow[];
    id: string;
    interactions: IBlockInteraction[];
    languageId: string;
    mode: SupportedMode;
    nestedFlowBlockInteractionIdStack: string[];
    resources: IResources;
    sessionVars: object;
    userId: string;
    constructor(contact: IContact, createdAt: string, cursor: CursorType, deliveryStatus: DeliveryStatus, entryAt: string, exitAt: string, firstFlowId: string, flows: IFlow[], id: string, interactions: IBlockInteraction[], languageId: string, mode: SupportedMode, nestedFlowBlockInteractionIdStack: string[], resources: IResources, sessionVars: object, userId: string);
    getResource(resourceId: string): IResource;
}
//# sourceMappingURL=Context.d.ts.map