import { NonBreakingUpdateOperation } from 'sp2';
import IContact from './IContact';
import IFlow from './IFlow';
import IBlockInteraction from './IBlockInteraction';
import IPrompt, { IBasePromptConfig, IPromptConfig } from '../domain/prompt/IPrompt';
import IBlock from './IBlock';
import DeliveryStatus from './DeliveryStatus';
import SupportedMode from './SupportedMode';
import { IResourceDefinition, IResources } from '..';
import IIdGenerator from '../domain/IIdGenerator';
export interface ICursor {
    interactionId: string;
    promptConfig?: (IPromptConfig<any> & IBasePromptConfig);
}
export interface ICursorInputRequired {
    interactionId: string;
    promptConfig: IPromptConfig<any> & IBasePromptConfig;
}
export interface ICursorNoInputRequired {
    interactionId: string;
    promptConfig: undefined;
}
export interface IRichCursor {
    interaction: IBlockInteraction;
    prompt?: IPrompt<IPromptConfig<any> & IBasePromptConfig>;
}
export interface IRichCursorInputRequired {
    interaction: IBlockInteraction;
    prompt: IPrompt<IPromptConfig<any> & IBasePromptConfig>;
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
    createdAt: string;
    entryAt?: string;
    exitAt?: string;
    deliveryStatus: DeliveryStatus;
    userId?: string;
    orgId?: string;
    mode: SupportedMode;
    languageId: string;
    contact: IContact;
    sessionVars: any;
    interactions: IBlockInteraction[];
    nestedFlowBlockInteractionIdStack: string[];
    reversibleOperations: IReversibleUpdateOperation[];
    cursor?: ICursor;
    flows: IFlow[];
    firstFlowId: string;
    resources: IResources;
    platformMetadata: object;
    logs: {
        [k: string]: string;
    };
}
export default IContext;
export interface IContextWithCursor extends IContext {
    cursor: ICursor;
}
export interface IContextInputRequired extends IContext {
    cursor: ICursorInputRequired;
}
export declare function createContextDataObjectFor(contact: IContact, userId: string, orgId: string, flows: IFlow[], languageId: string, mode?: SupportedMode, resources?: IResourceDefinition[], idGenerator?: IIdGenerator): IContext;
export declare function findInteractionWith(uuid: string, { interactions }: IContext): IBlockInteraction;
export declare function findFlowWith(uuid: string, { flows }: IContext): IFlow;
export declare function findBlockOnActiveFlowWith(uuid: string, ctx: IContext): IBlock;
export declare function findNestedFlowIdFor(interaction: IBlockInteraction, ctx: IContext): string;
export declare function getActiveFlowIdFrom(ctx: IContext): string;
export declare function getActiveFlowFrom(ctx: IContext): IFlow;
export declare function isLastBlockOn(ctx: IContext, block: IBlock): boolean;
export declare function isNested({ nestedFlowBlockInteractionIdStack }: IContext): boolean;
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
//# sourceMappingURL=IContext.d.ts.map