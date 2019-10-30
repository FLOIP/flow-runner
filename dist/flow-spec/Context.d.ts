import IContext from './IContext';
import IFlow from './IFlow';
import IContact from './IContact';
import DeliveryStatus from './DeliveryStatus';
import IBlockInteraction from './IBlockInteraction';
import { IResource, IResources, SupportedMode } from '..';
export default class Context implements IContext {
    id: string;
    createdAt: string;
    deliveryStatus: DeliveryStatus;
    mode: SupportedMode;
    languageId: string;
    contact: IContact;
    sessionVars: object;
    interactions: IBlockInteraction[];
    nestedFlowBlockInteractionIdStack: string[];
    flows: IFlow[];
    firstFlowId: string;
    resources: IResources;
    entryAt?: string | undefined;
    exitAt?: string | undefined;
    userId?: string | undefined;
    cursor?: [string, (import("..").IPromptConfig<any> & import("..").IBasePromptConfig) | undefined] | undefined;
    platformMetadata: object;
    constructor(id: string, createdAt: string, deliveryStatus: DeliveryStatus, mode: SupportedMode, languageId: string, contact: IContact, sessionVars: object, interactions: IBlockInteraction[], nestedFlowBlockInteractionIdStack: string[], flows: IFlow[], firstFlowId: string, resources: IResources, entryAt?: string | undefined, exitAt?: string | undefined, userId?: string | undefined, cursor?: [string, (import("..").IPromptConfig<any> & import("..").IBasePromptConfig) | undefined] | undefined, platformMetadata?: object);
    getResource(resourceId: string): IResource;
}
//# sourceMappingURL=Context.d.ts.map