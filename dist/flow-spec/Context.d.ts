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
import { DeliveryStatus, IBlockInteraction, IContact, IContext, ICursor, IFlow, IResourceWithContext, IReversibleUpdateOperation, SupportedMode, IGroup } from '..';
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
    }, interactions: IBlockInteraction[], nested_flow_block_interaction_id_stack: string[], reversible_operations: IReversibleUpdateOperation[], flows: IFlow[], first_flow_id: string, entry_at?: string, exit_at?: string, user_id?: string, org_id?: string, cursor?: ICursor, vendor_metadata?: {
        [k: string]: unknown;
    }, logs?: {
        [k: string]: string;
    });
    getResource(resourceId: string): IResourceWithContext;
}
/**
 * Namespacing must be used, because otherwise, Builder can not be referenced, without resulting in a compiler error,
 * due to this not being able to resolve the FlowRunner.Builder type, because the Builder is transpiled to an object definition
 */
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