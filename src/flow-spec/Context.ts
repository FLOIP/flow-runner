/* eslint-disable import/export,@typescript-eslint/no-namespace */
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

import {
  assertNotNull,
  createFormattedDate,
  DeliveryStatus,
  IBlockInteraction,
  IContact,
  IContext,
  ICursor,
  IFlow,
  IResourceWithContext,
  IReversibleUpdateOperation,
  ResourceResolver,
  SupportedMode,
  IGroup,
} from '..'
import {IResource, IResources} from '../flow-spec/IResource'

// noinspection DuplicatedCode
export class Context implements IContext {
  public id: string
  public created_at: string
  public delivery_status: DeliveryStatus
  public mode: SupportedMode
  public language_id: string
  public contact: IContact
  public groups: IGroup[]
  public session_vars: {[k: string]: unknown}
  public interactions: IBlockInteraction[]
  public nested_flow_block_interaction_id_stack: string[]
  public reversible_operations: IReversibleUpdateOperation[]
  public flows: IFlow[]
  public first_flow_id: string
  public resources: IResources
  public entry_at?: string
  public exit_at?: string
  public user_id?: string
  public org_id?: string
  public cursor?: ICursor
  public vendor_metadata: {[k: string]: unknown} = {}
  public logs: {[k: string]: string} = {}

  constructor(
    id: string,
    created_at: string,
    delivery_status: DeliveryStatus,
    mode: SupportedMode,
    language_id: string,
    contact: IContact,
    groups: IGroup[],
    session_vars: {[k: string]: unknown},
    interactions: IBlockInteraction[],
    nested_flow_block_interaction_id_stack: string[],
    reversible_operations: IReversibleUpdateOperation[],
    flows: IFlow[],
    first_flow_id: string,
    resources: IResources,
    entry_at?: string,
    exit_at?: string,
    user_id?: string,
    org_id?: string,
    cursor?: ICursor,
    vendor_metadata: {[k: string]: unknown} = {},
    logs: {[k: string]: string} = {}
  ) {
    this.logs = logs
    this.vendor_metadata = vendor_metadata
    this.cursor = cursor
    this.org_id = org_id
    this.user_id = user_id
    this.exit_at = exit_at
    this.entry_at = entry_at
    this.resources = resources
    this.first_flow_id = first_flow_id
    this.flows = flows
    this.reversible_operations = reversible_operations
    this.nested_flow_block_interaction_id_stack = nested_flow_block_interaction_id_stack
    this.interactions = interactions
    this.session_vars = session_vars
    this.contact = contact
    this.groups = groups
    this.language_id = language_id
    this.mode = mode
    this.delivery_status = delivery_status
    this.created_at = created_at
    this.id = id
  }

  getResource(resourceId: string): IResourceWithContext {
    return new ResourceResolver(this).resolve(resourceId)
  }
}

/**
 * Namespacing must be used, because otherwise, Builder can not be referenced, without resulting in a compiler error,
 * due to this not being able to resolve the FlowRunner.Builder type, because the Builder is transpiled to an object definition
 */
export namespace Context {
  // noinspection JSUnusedGlobalSymbols
  export class Builder {
    id?: string
    created_at: string = createFormattedDate()
    delivery_status: DeliveryStatus = DeliveryStatus.QUEUED
    mode: SupportedMode = SupportedMode.OFFLINE
    language_id?: string
    contact?: IContact
    groups?: IGroup[]
    session_vars: {[k: string]: unknown} = {}
    interactions: IBlockInteraction[] = []
    nested_flow_block_interaction_id_stack: string[] = []
    reversible_operations: IReversibleUpdateOperation[] = []
    flows?: IFlow[]
    first_flow_id?: string
    resources?: IResource[]
    entry_at?: string
    exit_at?: string
    user_id?: string
    org_id?: string
    cursor?: ICursor
    vendor_metadata: {[k: string]: unknown} = {}
    logs: {[k: string]: string} = {}

    setId(id: string): Context.Builder {
      this.id = id
      return this
    }

    setCreatedAt(created_at: string): Context.Builder {
      this.created_at = created_at
      return this
    }

    setDeliveryStatus(delivery_status: DeliveryStatus): Context.Builder {
      this.delivery_status = delivery_status
      return this
    }

    setMode(mode: SupportedMode): Context.Builder {
      this.mode = mode
      return this
    }

    setLanguageId(language_id: string): Context.Builder {
      this.language_id = language_id
      return this
    }

    setContact(contact: IContact): Context.Builder {
      this.contact = contact
      return this
    }

    setGroups(groups: IGroup[]): Context.Builder {
      this.groups = groups
      return this
    }

    setSessionVars(session_vars: {[k: string]: unknown}): Context.Builder {
      this.session_vars = session_vars
      return this
    }

    setInteractions(interactions: IBlockInteraction[]): Context.Builder {
      this.interactions = interactions
      return this
    }

    setNestedFlowBlockInteractionIdStack(nested_flow_block_interaction_id_stack: string[]): Context.Builder {
      this.nested_flow_block_interaction_id_stack = nested_flow_block_interaction_id_stack
      return this
    }

    setReversibleOperations(reversible_operations: IReversibleUpdateOperation[]): Context.Builder {
      this.reversible_operations = reversible_operations
      return this
    }

    setFlows(flows: IFlow[]): Context.Builder {
      this.flows = flows
      return this
    }

    setFirstFlowId(first_flow_id: string): Context.Builder {
      this.first_flow_id = first_flow_id
      return this
    }

    setResources(resources: IResource[]): Context.Builder {
      this.resources = resources
      return this
    }

    setEntryAt(entry_at: string): Context.Builder {
      this.entry_at = entry_at
      return this
    }

    setExitAt(exit_at: string): Context.Builder {
      this.exit_at = exit_at
      return this
    }

    setUserId(user_id: string): Context.Builder {
      this.user_id = user_id
      return this
    }

    setOrgId(org_id: string): Context.Builder {
      this.org_id = org_id
      return this
    }

    setCursor(cursor: ICursor): Context.Builder {
      this.cursor = cursor
      return this
    }

    setPlatformMetadata(vendor_metadata: {[k: string]: unknown}): Context.Builder {
      this.vendor_metadata = vendor_metadata
      return this
    }

    setLogs(logs: {[p: string]: string}): Context.Builder {
      this.logs = logs
      return this
    }

    build(): Context {
      assertNotNull(this.id, () => 'Context.Builder.setId() must be called before build()')
      assertNotNull(this.language_id, () => 'Context.Builder.setLanguageId() must be called before build()')
      assertNotNull(this.contact, () => 'Context.Builder.setContact() must be called before build()')
      assertNotNull(this.groups, () => 'Context.Builder.setGroups() must be called before build()')
      assertNotNull(this.flows, () => 'Context.Builder.setFlows() must be called before build()')
      assertNotNull(this.first_flow_id, () => 'Context.Builder.setFirstFlowId() must be called before build()')
      assertNotNull(this.resources, () => 'Context.Builder.setResources() must be called before build()')

      return new Context(
        this.id,
        this.created_at,
        this.delivery_status,
        this.mode,
        this.language_id,
        this.contact,
        this.groups,
        this.session_vars,
        this.interactions,
        this.nested_flow_block_interaction_id_stack,
        this.reversible_operations,
        this.flows,
        this.first_flow_id,
        this.resources,
        this.entry_at,
        this.exit_at,
        this.user_id,
        this.org_id,
        this.cursor,
        this.vendor_metadata,
        this.logs
      )
    }
  }
}
