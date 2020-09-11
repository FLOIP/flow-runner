import { DeliveryStatus, IBlockInteraction, IContact, IContext, ICursor, IFlow, IResource, IResourceDefinition, IResources, IReversibleUpdateOperation, SupportedMode } from '../../index';
export declare class Context implements IContext {
    id: string;
    createdAt: string;
    deliveryStatus: DeliveryStatus;
    mode: SupportedMode;
    languageId: string;
    contact: IContact;
    sessionVars: {
        [k: string]: unknown;
    };
    interactions: IBlockInteraction[];
    nestedFlowBlockInteractionIdStack: string[];
    reversibleOperations: IReversibleUpdateOperation[];
    flows: IFlow[];
    firstFlowId: string;
    resources: IResources;
    entryAt?: string;
    exitAt?: string;
    userId?: string;
    orgId?: string;
    cursor?: ICursor;
    platformMetadata: {
        [k: string]: unknown;
    };
    logs: {
        [k: string]: string;
    };
    constructor(id: string, createdAt: string, deliveryStatus: DeliveryStatus, mode: SupportedMode, languageId: string, contact: IContact, sessionVars: {
        [k: string]: unknown;
    }, interactions: IBlockInteraction[], nestedFlowBlockInteractionIdStack: string[], reversibleOperations: IReversibleUpdateOperation[], flows: IFlow[], firstFlowId: string, resources: IResources, entryAt?: string, exitAt?: string, userId?: string, orgId?: string, cursor?: ICursor, platformMetadata?: {
        [k: string]: unknown;
    }, logs?: {
        [k: string]: string;
    });
    getResource(resourceId: string): IResource;
}
export declare namespace Context {
    class Builder {
        id?: string;
        createdAt: string;
        deliveryStatus: DeliveryStatus;
        mode: SupportedMode;
        languageId?: string;
        contact?: IContact;
        sessionVars: {
            [k: string]: unknown;
        };
        interactions: IBlockInteraction[];
        nestedFlowBlockInteractionIdStack: string[];
        reversibleOperations: IReversibleUpdateOperation[];
        flows?: IFlow[];
        firstFlowId?: string;
        resources?: IResourceDefinition[];
        entryAt?: string;
        exitAt?: string;
        userId?: string;
        orgId?: string;
        cursor?: ICursor;
        platformMetadata: {
            [k: string]: unknown;
        };
        logs: {
            [k: string]: string;
        };
        setId(id: string): Context.Builder;
        setCreatedAt(createdAt: string): Context.Builder;
        setDeliveryStatus(deliveryStatus: DeliveryStatus): Context.Builder;
        setMode(mode: SupportedMode): Context.Builder;
        setLanguageId(languageId: string): Context.Builder;
        setContact(contact: IContact): Context.Builder;
        setSessionVars(sessionVars: {
            [k: string]: unknown;
        }): Context.Builder;
        setInteractions(interactions: IBlockInteraction[]): Context.Builder;
        setNestedFlowBlockInteractionIdStack(nestedFlowBlockInteractionIdStack: string[]): Context.Builder;
        setReversibleOperations(reversibleOperations: IReversibleUpdateOperation[]): Context.Builder;
        setFlows(flows: IFlow[]): Context.Builder;
        setFirstFlowId(firstFlowId: string): Context.Builder;
        setResources(resources: IResourceDefinition[]): Context.Builder;
        setEntryAt(entryAt: string): Context.Builder;
        setExitAt(exitAt: string): Context.Builder;
        setUserId(userId: string): Context.Builder;
        setOrgId(orgId: string): Context.Builder;
        setCursor(cursor: ICursor): Context.Builder;
        setPlatformMetadata(platformMetadata: {
            [k: string]: unknown;
        }): Context.Builder;
        setLogs(logs: {
            [p: string]: string;
        }): Context.Builder;
        build(): Context;
    }
}
//# sourceMappingURL=Context.d.ts.map