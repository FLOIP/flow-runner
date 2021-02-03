import { DeliveryStatus, IBlockInteraction, IContact, IContext, ICursor, IFlow, IResource, IResourceDefinition, IResources, IReversibleUpdateOperation, SupportedMode, IGroup } from '..';
export declare class Context implements IContext {
    id: string;
    created_at: string;
    delivery_status: DeliveryStatus;
    mode: SupportedMode;
    language_id: string;
    contact: IContact;
    groups: IGroup[];
    session_vars: {
        [k: string]: unknown;
    };
    interactions: IBlockInteraction[];
    nested_flow_block_interaction_id_stack: string[];
    reversible_operations: IReversibleUpdateOperation[];
    flows: IFlow[];
    first_flow_id: string;
    resources: IResources;
    entry_at?: string;
    exit_at?: string;
    user_id?: string;
    org_id?: string;
    cursor?: ICursor;
    platform_metadata: {
        [k: string]: unknown;
    };
    logs: {
        [k: string]: string;
    };
    constructor(id: string, createdAt: string, deliveryStatus: DeliveryStatus, mode: SupportedMode, languageId: string, contact: IContact, groups: IGroup[], sessionVars: {
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
        groups?: IGroup[];
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
        setGroups(groups: IGroup[]): Context.Builder;
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