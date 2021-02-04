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
    vendor_metadata: {
        [k: string]: unknown;
    };
    logs: {
        [k: string]: string;
    };
    constructor(id: string, created_at: string, delivery_status: DeliveryStatus, mode: SupportedMode, language_id: string, contact: IContact, groups: IGroup[], session_vars: {
        [k: string]: unknown;
    }, interactions: IBlockInteraction[], nested_flow_block_interaction_id_stack: string[], reversible_operations: IReversibleUpdateOperation[], flows: IFlow[], first_flow_id: string, resources: IResources, entry_at?: string, exit_at?: string, user_id?: string, org_id?: string, cursor?: ICursor, vendor_metadata?: {
        [k: string]: unknown;
    }, logs?: {
        [k: string]: string;
    });
    getResource(resourceId: string): IResource;
}
export declare namespace Context {
    class Builder {
        id?: string;
        created_at: string;
        delivery_status: DeliveryStatus;
        mode: SupportedMode;
        language_id?: string;
        contact?: IContact;
        groups?: IGroup[];
        session_vars: {
            [k: string]: unknown;
        };
        interactions: IBlockInteraction[];
        nested_flow_block_interaction_id_stack: string[];
        reversible_operations: IReversibleUpdateOperation[];
        flows?: IFlow[];
        first_flow_id?: string;
        resources?: IResourceDefinition[];
        entry_at?: string;
        exit_at?: string;
        user_id?: string;
        org_id?: string;
        cursor?: ICursor;
        vendor_metadata: {
            [k: string]: unknown;
        };
        logs: {
            [k: string]: string;
        };
        setId(id: string): Context.Builder;
        setCreatedAt(created_at: string): Context.Builder;
        setDeliveryStatus(delivery_status: DeliveryStatus): Context.Builder;
        setMode(mode: SupportedMode): Context.Builder;
        setLanguageId(language_id: string): Context.Builder;
        setContact(contact: IContact): Context.Builder;
        setGroups(groups: IGroup[]): Context.Builder;
        setSessionVars(session_vars: {
            [k: string]: unknown;
        }): Context.Builder;
        setInteractions(interactions: IBlockInteraction[]): Context.Builder;
        setNestedFlowBlockInteractionIdStack(nested_flow_block_interaction_id_stack: string[]): Context.Builder;
        setReversibleOperations(reversible_operations: IReversibleUpdateOperation[]): Context.Builder;
        setFlows(flows: IFlow[]): Context.Builder;
        setFirstFlowId(first_flow_id: string): Context.Builder;
        setResources(resources: IResourceDefinition[]): Context.Builder;
        setEntryAt(entry_at: string): Context.Builder;
        setExitAt(exit_at: string): Context.Builder;
        setUserId(user_id: string): Context.Builder;
        setOrgId(org_id: string): Context.Builder;
        setCursor(cursor: ICursor): Context.Builder;
        setPlatformMetadata(vendor_metadata: {
            [k: string]: unknown;
        }): Context.Builder;
        setLogs(logs: {
            [p: string]: string;
        }): Context.Builder;
        build(): Context;
    }
}
//# sourceMappingURL=Context.d.ts.map