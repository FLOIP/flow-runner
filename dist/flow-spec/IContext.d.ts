import { NonBreakingUpdateOperation } from 'sp2';
import { DeliveryStatus, IBlock, IBlockInteraction, IContact, IFlow, IGroup, IIdGenerator, IPrompt, IPromptConfig, IResourceDefinition, IResources, SupportedMode } from '..';
export interface ICursor {
    interactionId: string;
    promptConfig?: IPromptConfig<unknown>;
}
export interface ICursorInputRequired {
    interactionId: string;
    promptConfig: IPromptConfig<unknown>;
}
export interface ICursorNoInputRequired {
    interactionId: string;
    promptConfig: undefined;
}
export interface IRichCursor {
    interaction: IBlockInteraction;
    prompt?: IPrompt<IPromptConfig<any>>;
}
export interface IRichCursorInputRequired {
    interaction: IBlockInteraction;
    prompt: IPrompt<IPromptConfig<any>>;
}
export interface IRichCursorNoInputRequired {
    interaction: IBlockInteraction;
    prompt: undefined;
}
export interface IReversibleUpdateOperation {
    interactionId?: string;
    forward: NonBreakingUpdateOperation;
    reverse: NonBreakingUpdateOperation;
}
export interface IContext {
    id: string;
    created_at: string;
    entry_at?: string;
    exit_at?: string;
    delivery_status: DeliveryStatus;
    user_id?: string;
    org_id?: string;
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
    cursor?: ICursor;
    flows: IFlow[];
    first_flow_id: string;
    resources: IResources;
    platform_metadata: {
        [k: string]: unknown;
    };
    logs: {
        [k: string]: string;
    };
}
export interface IContextWithCursor extends IContext {
    cursor: ICursor;
}
export interface IContextInputRequired extends IContext {
    cursor: ICursorInputRequired;
}
export declare function createContextDataObjectFor(contact: IContact, groups: IGroup[], userId: string, orgId: string, flows: IFlow[], languageId: string, mode?: SupportedMode, resources?: IResourceDefinition[], idGenerator?: IIdGenerator): IContext;
export declare function findInteractionWith(uuid: string, { interactions }: IContext): IBlockInteraction;
export declare function findFlowWith(uuid: string, { flows }: IContext): IFlow;
export declare function findBlockOnActiveFlowWith(uuid: string, ctx: IContext): IBlock;
export declare function findNestedFlowIdFor(interaction: IBlockInteraction, ctx: IContext): string;
export declare function getActiveFlowIdFrom(ctx: IContext): string;
export declare function getActiveFlowFrom(ctx: IContext): IFlow;
export declare function isLastBlockOn(ctx: IContext, block: IBlock): boolean;
export declare function isNested({ nested_flow_block_interaction_id_stack }: IContext): boolean;
export declare const contextService: IContextService;
export interface IContextService {
    findInteractionWith(uuid: string, { interactions }: IContext): IBlockInteraction;
    findFlowWith(uuid: string, ctx: IContext): IFlow;
    findBlockOnActiveFlowWith(uuid: string, ctx: IContext): IBlock;
    findNestedFlowIdFor(interaction: IBlockInteraction, ctx: IContext): string;
    getActiveFlowIdFrom(ctx: IContext): string;
    getActiveFlowFrom(ctx: IContext): IFlow;
    isLastBlockOn(ctx: IContext, block: IBlock): boolean;
    isNested(ctx: IContext): boolean;
}
export declare const ContextService: IContextService;
//# sourceMappingURL=IContext.d.ts.map