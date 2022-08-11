/**
 * Flow Interoperability Project (flowinterop.org)
 * Flow Runner
 * Copyright (c) 2019, 2020 Viamo Inc.
 * Authored by: Brett Zabos (brett.zabos@viamo.io)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/
import { NonBreakingUpdateOperation } from 'sp2';
import { DeliveryStatus, IBlock, IBlockInteraction, IContact, IFlow, IGroup, IIdGenerator, IPrompt, IPromptConfig, SupportedMode } from '..';
export interface ICursor {
    /**
     * UUID of the current interaction with a block.
     */
    interactionId: string;
    /**
     * A prompt configuration data object; optional, because not every block requests input from the Contact.
     * If it does, we call it an `ICursorInputRequired`.
     * If not, `ICursorNoInputRequired` will have a `null-ish` `promptConfig`.
     */
    promptConfig?: IPromptConfig;
}
export interface ICursorInputRequired {
    interactionId: string;
    promptConfig: IPromptConfig;
}
export interface ICursorNoInputRequired {
    interactionId: string;
    promptConfig: undefined;
}
export interface IRichCursor<PROMPT_CONFIG extends IPromptConfig = IPromptConfig> {
    /**
     * An object representation of the current interaction with a block.
     */
    interaction: IBlockInteraction;
    /**
     * In IPrompt instance.
     * When present, we call it a TRichCursorInputRequired.
     * In absence, the TRichCursorNoInputRequired will maintain `prompt` with a null-ish value.
     */
    prompt?: IPrompt<PROMPT_CONFIG>;
}
export interface IRichCursorInputRequired<PROMPT_CONFIG extends IPromptConfig = IPromptConfig> {
    interaction: IBlockInteraction;
    prompt: IPrompt<PROMPT_CONFIG>;
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
    vendor_metadata: {
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
export declare function createContextDataObjectFor(contact: IContact, groups: IGroup[], userId: string, orgId: string, flows: IFlow[], languageId: string, mode?: SupportedMode, idGenerator?: IIdGenerator): Promise<IContext>;
export declare function findInteractionWith(uuid: string, { interactions }: IContext): IBlockInteraction;
export declare function findFlowWith(uuid: string, { flows }: IContext): IFlow;
export declare function findBlockOnActiveFlowWith(uuid: string, ctx: IContext): IBlock;
export declare function findNestedFlowIdFor(interaction: IBlockInteraction, ctx: IContext): string;
export declare function getActiveFlowIdFrom(ctx: IContext): string;
export declare function getActiveFlowFrom(ctx: IContext): IFlow;
export declare function isLastBlockOn(ctx: IContext, block: IBlock): boolean;
export declare function isNested({ nested_flow_block_interaction_id_stack }: IContext): boolean;
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