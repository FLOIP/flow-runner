import IContact from "./IContact";
import IFlow from "./IFlow";
import ISession from "./ISession";
import IBlockInteraction from "./IBlockInteraction";
import IPrompt, { IBasePromptConfig, IPromptConfig } from "../domain/prompt/IPrompt";
import IBlock from "./IBlock";
export declare type CursorType = [string, (IPromptConfig<any> & IBasePromptConfig) | null];
export declare type CursorInputRequiredType = [string, IPromptConfig<any> & IBasePromptConfig];
export declare type CursorNoInputRequiredType = [string, null];
export declare type RichCursorType = [IBlockInteraction, IPrompt<IPromptConfig<any> & IBasePromptConfig> | null];
export declare type RichCursorInputRequiredType = [IBlockInteraction, IPrompt<IPromptConfig<any> & IBasePromptConfig>];
export declare type RichCursorNoInputRequiredType = [IBlockInteraction, null];
export default interface IContext {
    flows: IFlow[];
    firstFlowId: string;
    interactions: IBlockInteraction[];
    contact: IContact;
    session: ISession;
    sessionVars: object;
    nestedFlowBlockInteractionIdStack: string[];
    cursor: CursorType | null;
}
export interface IContextWithCursor extends IContext {
    cursor: CursorType;
}
export interface IContextInputRequired extends IContext {
    cursor: CursorInputRequiredType;
}
export declare function findInteractionWith(uuid: string, { interactions }: IContext): IBlockInteraction;
export declare function findFlowWith(uuid: string, { flows }: IContext): IFlow;
export declare function findBlockOnActiveFlowWith(uuid: string, ctx: IContext): IBlock;
export declare function findNestedFlowIdFor(interaction: IBlockInteraction, ctx: IContext): string;
export declare function getActiveFlowIdFrom(ctx: IContext): string;
export declare function getActiveFlowFrom(ctx: IContext): IFlow;
//# sourceMappingURL=IContext.d.ts.map