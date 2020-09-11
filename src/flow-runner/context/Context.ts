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
  IResource,
  IResourceDefinition,
  IResources,
  IReversibleUpdateOperation,
  ResourceResolver,
  SupportedMode,
} from '../../index'

// noinspection DuplicatedCode
export class Context implements IContext {
  public id: string
  public createdAt: string
  public deliveryStatus: DeliveryStatus
  public mode: SupportedMode
  public languageId: string
  public contact: IContact
  public sessionVars: {[k: string]: unknown}
  public interactions: IBlockInteraction[]
  public nestedFlowBlockInteractionIdStack: string[]
  public reversibleOperations: IReversibleUpdateOperation[]
  public flows: IFlow[]
  public firstFlowId: string
  public resources: IResources
  public entryAt?: string
  public exitAt?: string
  public userId?: string
  public orgId?: string
  public cursor?: ICursor
  public platformMetadata: {[k: string]: unknown} = {}
  public logs: {[k: string]: string} = {}

  constructor(
    id: string,
    createdAt: string,
    deliveryStatus: DeliveryStatus,
    mode: SupportedMode,
    languageId: string,
    contact: IContact,
    sessionVars: {[k: string]: unknown},
    interactions: IBlockInteraction[],
    nestedFlowBlockInteractionIdStack: string[],
    reversibleOperations: IReversibleUpdateOperation[],
    flows: IFlow[],
    firstFlowId: string,
    resources: IResources,
    entryAt?: string,
    exitAt?: string,
    userId?: string,
    orgId?: string,
    cursor?: ICursor,
    platformMetadata: {[k: string]: unknown} = {},
    logs: {[k: string]: string} = {}
  ) {
    this.logs = logs
    this.platformMetadata = platformMetadata
    this.cursor = cursor
    this.orgId = orgId
    this.userId = userId
    this.exitAt = exitAt
    this.entryAt = entryAt
    this.resources = resources
    this.firstFlowId = firstFlowId
    this.flows = flows
    this.reversibleOperations = reversibleOperations
    this.nestedFlowBlockInteractionIdStack = nestedFlowBlockInteractionIdStack
    this.interactions = interactions
    this.sessionVars = sessionVars
    this.contact = contact
    this.languageId = languageId
    this.mode = mode
    this.deliveryStatus = deliveryStatus
    this.createdAt = createdAt
    this.id = id
  }

  getResource(resourceId: string): IResource {
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
    createdAt: string = createFormattedDate()
    deliveryStatus: DeliveryStatus = DeliveryStatus.QUEUED
    mode: SupportedMode = SupportedMode.OFFLINE
    languageId?: string
    contact?: IContact
    sessionVars: {[k: string]: unknown} = {}
    interactions: IBlockInteraction[] = []
    nestedFlowBlockInteractionIdStack: string[] = []
    reversibleOperations: IReversibleUpdateOperation[] = []
    flows?: IFlow[]
    firstFlowId?: string
    resources?: IResourceDefinition[]
    entryAt?: string
    exitAt?: string
    userId?: string
    orgId?: string
    cursor?: ICursor
    platformMetadata: {[k: string]: unknown} = {}
    logs: {[k: string]: string} = {}

    setId(id: string): Context.Builder {
      this.id = id
      return this
    }

    setCreatedAt(createdAt: string): Context.Builder {
      this.createdAt = createdAt
      return this
    }

    setDeliveryStatus(deliveryStatus: DeliveryStatus): Context.Builder {
      this.deliveryStatus = deliveryStatus
      return this
    }

    setMode(mode: SupportedMode): Context.Builder {
      this.mode = mode
      return this
    }

    setLanguageId(languageId: string): Context.Builder {
      this.languageId = languageId
      return this
    }

    setContact(contact: IContact): Context.Builder {
      this.contact = contact
      return this
    }

    setSessionVars(sessionVars: {[k: string]: unknown}): Context.Builder {
      this.sessionVars = sessionVars
      return this
    }

    setInteractions(interactions: IBlockInteraction[]): Context.Builder {
      this.interactions = interactions
      return this
    }

    setNestedFlowBlockInteractionIdStack(nestedFlowBlockInteractionIdStack: string[]): Context.Builder {
      this.nestedFlowBlockInteractionIdStack = nestedFlowBlockInteractionIdStack
      return this
    }

    setReversibleOperations(reversibleOperations: IReversibleUpdateOperation[]): Context.Builder {
      this.reversibleOperations = reversibleOperations
      return this
    }

    setFlows(flows: IFlow[]): Context.Builder {
      this.flows = flows
      return this
    }

    setFirstFlowId(firstFlowId: string): Context.Builder {
      this.firstFlowId = firstFlowId
      return this
    }

    setResources(resources: IResourceDefinition[]): Context.Builder {
      this.resources = resources
      return this
    }

    setEntryAt(entryAt: string): Context.Builder {
      this.entryAt = entryAt
      return this
    }

    setExitAt(exitAt: string): Context.Builder {
      this.exitAt = exitAt
      return this
    }

    setUserId(userId: string): Context.Builder {
      this.userId = userId
      return this
    }

    setOrgId(orgId: string): Context.Builder {
      this.orgId = orgId
      return this
    }

    setCursor(cursor: ICursor): Context.Builder {
      this.cursor = cursor
      return this
    }

    setPlatformMetadata(platformMetadata: {[k: string]: unknown}): Context.Builder {
      this.platformMetadata = platformMetadata
      return this
    }

    setLogs(logs: {[p: string]: string}): Context.Builder {
      this.logs = logs
      return this
    }

    build(): Context {
      assertNotNull(this.id, () => 'Context.Builder.setId() must be called before build()')
      assertNotNull(this.languageId, () => 'Context.Builder.setLanguageId() must be called before build()')
      assertNotNull(this.contact, () => 'Context.Builder.setContact() must be called before build()')
      assertNotNull(this.flows, () => 'Context.Builder.setFlows() must be called before build()')
      assertNotNull(this.firstFlowId, () => 'Context.Builder.setFirstFlowId() must be called before build()')
      assertNotNull(this.resources, () => 'Context.Builder.setResources() must be called before build()')

      return new Context(
        this.id,
        this.createdAt,
        this.deliveryStatus,
        this.mode,
        this.languageId,
        this.contact,
        this.sessionVars,
        this.interactions,
        this.nestedFlowBlockInteractionIdStack,
        this.reversibleOperations,
        this.flows,
        this.firstFlowId,
        this.resources,
        this.entryAt,
        this.exitAt,
        this.userId,
        this.orgId,
        this.cursor,
        this.platformMetadata,
        this.logs
      )
    }
  }
}