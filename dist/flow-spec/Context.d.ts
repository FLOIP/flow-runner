import { DeliveryStatus, IBlockInteraction, IContact, IContext, ICursor, IFlow, IResource, IResourceDefinition, IResources, IReversibleUpdateOperation, SupportedMode } from '..';
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
    static readonly Builder: {
        new (): {
            id?: string | undefined;
            createdAt: string;
            deliveryStatus: DeliveryStatus;
            mode: SupportedMode;
            languageId?: string | undefined;
            contact?: IContact | undefined;
            sessionVars: {
                [k: string]: unknown;
            };
            interactions: IBlockInteraction[];
            nestedFlowBlockInteractionIdStack: string[];
            reversibleOperations: IReversibleUpdateOperation[];
            flows?: IFlow[] | undefined;
            firstFlowId?: string | undefined;
            resources?: IResourceDefinition[] | undefined;
            entryAt?: string | undefined;
            exitAt?: string | undefined;
            userId?: string | undefined;
            orgId?: string | undefined;
            cursor?: ICursor | undefined;
            platformMetadata: {
                [k: string]: unknown;
            };
            logs: {
                [k: string]: string;
            };
            setId(id: string): this;
            setCreatedAt(createdAt: string): this;
            setDeliveryStatus(deliveryStatus: DeliveryStatus): this;
            setMode(mode: SupportedMode): this;
            setLanguageId(languageId: string): this;
            setContact(contact: IContact): this;
            setSessionVars(sessionVars: {
                [k: string]: unknown;
            }): this;
            setInteractions(interactions: IBlockInteraction[]): this;
            setNestedFlowBlockInteractionIdStack(nestedFlowBlockInteractionIdStack: string[]): this;
            setReversibleOperations(reversibleOperations: IReversibleUpdateOperation[]): this;
            setFlows(flows: IFlow[]): this;
            setFirstFlowId(firstFlowId: string): this;
            setResources(resources: IResourceDefinition[]): this;
            setEntryAt(entryAt: string): this;
            setExitAt(exitAt: string): this;
            setUserId(userId: string): this;
            setOrgId(orgId: string): this;
            setCursor(cursor: ICursor): this;
            setPlatformMetadata(platformMetadata: {
                [k: string]: unknown;
            }): this;
            setLogs(logs: {
                [p: string]: string;
            }): this;
            build(): Context;
        };
    };
}
//# sourceMappingURL=Context.d.ts.map