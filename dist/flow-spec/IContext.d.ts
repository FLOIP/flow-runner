import IContact from './IContact';
import IFlow from './IFlow';
import IBlockInteraction from './IBlockInteraction';
import IPrompt, { IBasePromptConfig, IPromptConfig } from '../domain/prompt/IPrompt';
import IBlock from './IBlock';
import DeliveryStatus from './DeliveryStatus';
import SupportedMode from './SupportedMode';
import { IResourceDefinition, IResources } from '..';
export declare type CursorType = [string, (IPromptConfig<any> & IBasePromptConfig) | undefined];
export declare type CursorInputRequiredType = [string, IPromptConfig<any> & IBasePromptConfig];
export declare type CursorNoInputRequiredType = [string, undefined];
export declare type RichCursorType = [IBlockInteraction, IPrompt<IPromptConfig<any> & IBasePromptConfig> | undefined];
export declare type RichCursorInputRequiredType = [IBlockInteraction, IPrompt<IPromptConfig<any> & IBasePromptConfig>];
export declare type RichCursorNoInputRequiredType = [IBlockInteraction, undefined];
export default interface IContext {
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
    sessionVars: object;
    interactions: IBlockInteraction[];
    nestedFlowBlockInteractionIdStack: string[];
    cursor?: CursorType;
    flows: IFlow[];
    firstFlowId: string;
    resources: IResources;
    platformMetadata: object;
}
export interface IContextWithCursor extends IContext {
    cursor: CursorType;
}
export interface IContextInputRequired extends IContext {
    cursor: CursorInputRequiredType;
}
export declare function createContextDataObjectFor(contact: IContact, userId: string, orgId: string, flows: IFlow[], languageId: string, mode: SupportedMode, resources?: IResourceDefinition[]): IContext;
export declare function findInteractionWith(uuid: string, { interactions }: IContext): IBlockInteraction;
export declare function findFlowWith(uuid: string, { flows }: IContext): IFlow;
export declare function findBlockOnActiveFlowWith(uuid: string, ctx: IContext): IBlock;
export declare function findNestedFlowIdFor(interaction: IBlockInteraction, ctx: IContext): string;
export declare function getActiveFlowIdFrom(ctx: IContext): string;
export declare function getActiveFlowFrom(ctx: IContext): IFlow;
//# sourceMappingURL=IContext.d.ts.map