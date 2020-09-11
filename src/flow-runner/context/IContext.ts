/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {NonBreakingUpdateOperation} from 'sp2'
import {
  createFormattedDate,
  DeliveryStatus,
  findBlockWith,
  IBlock,
  IBlockInteraction,
  IContact,
  IdGeneratorUuidV4,
  IFlow,
  IIdGenerator,
  IPrompt,
  IPromptConfig,
  IResourceDefinition,
  IResources,
  IRunFlowBlockConfig,
  isLastBlock,
  SupportedMode,
  ValidationException,
} from '../../index'
import {find, findLast, last} from 'lodash'

export interface ICursor {
  /**
   * UUID of the current interaction with a block.
   */
  interactionId: string
  /**
   * A prompt configuration data object; optional, because not every block requests input from the Contact.
   * If it does, we call it an `ICursorInputRequired`.
   * If not, `ICursorNoInputRequired` will have a `null-ish` `promptConfig`.
   */
  promptConfig?: IPromptConfig<unknown>
}

export interface ICursorInputRequired {
  interactionId: string
  promptConfig: IPromptConfig<unknown>
}

export interface ICursorNoInputRequired {
  interactionId: string
  promptConfig: undefined
}

export interface IRichCursor {
  /**
   * An object representation of the current interaction with a block.
   */
  interaction: IBlockInteraction
  /**
   * In IPrompt instance.
   * When present, we call it a TRichCursorInputRequired.
   * In absence, the TRichCursorNoInputRequired will maintain `prompt` with a null-ish value.
   */
  prompt?: IPrompt<IPromptConfig<any>>
}

export interface IRichCursorInputRequired {
  interaction: IBlockInteraction
  prompt: IPrompt<IPromptConfig<any>>
}

export interface IRichCursorNoInputRequired {
  interaction: IBlockInteraction
  prompt: undefined
}

export interface IReversibleUpdateOperation {
  interactionId?: string
  forward: NonBreakingUpdateOperation
  reverse: NonBreakingUpdateOperation
}

export interface IContext {
  id: string
  createdAt: string
  entryAt?: string
  exitAt?: string
  deliveryStatus: DeliveryStatus

  userId?: string
  orgId?: string
  mode: SupportedMode
  languageId: string

  contact: IContact

  sessionVars: {[k: string]: unknown}
  interactions: IBlockInteraction[]
  nestedFlowBlockInteractionIdStack: string[]
  reversibleOperations: IReversibleUpdateOperation[]
  cursor?: ICursor

  flows: IFlow[]
  firstFlowId: string
  resources: IResources
  platformMetadata: {[k: string]: unknown}

  logs: {[k: string]: string}
}

export interface IContextWithCursor extends IContext {
  cursor: ICursor
}

export interface IContextInputRequired extends IContext {
  cursor: ICursorInputRequired
}

export function createContextDataObjectFor(
  contact: IContact,
  userId: string,
  orgId: string,
  flows: IFlow[],
  languageId: string,
  mode: SupportedMode = SupportedMode.OFFLINE,
  resources: IResourceDefinition[] = [],
  idGenerator: IIdGenerator = new IdGeneratorUuidV4()
): IContext {
  return {
    id: idGenerator.generate(),
    createdAt: createFormattedDate(),
    deliveryStatus: DeliveryStatus.QUEUED,

    userId,
    orgId,
    mode,
    languageId,

    contact,
    sessionVars: {},
    interactions: [],
    nestedFlowBlockInteractionIdStack: [],
    reversibleOperations: [],

    flows,
    firstFlowId: flows[0].uuid,

    resources,
    platformMetadata: {},

    logs: {},
  }
}

export function findInteractionWith(uuid: string, {interactions}: IContext): IBlockInteraction {
  const interaction = findLast(interactions, {uuid})
  if (interaction == null) {
    throw new ValidationException(`Unable to find interaction on context: ${uuid} in [${interactions.map(i => i.uuid)}]`)
  }

  return interaction
}

export function findFlowWith(uuid: string, {flows}: IContext): IFlow {
  const flow = find(flows, {uuid})
  if (flow == null) {
    throw new ValidationException(`Unable to find flow on context: ${uuid} in ${flows.map(f => f.uuid)}`)
  }

  return flow
}

export function findBlockOnActiveFlowWith(uuid: string, ctx: IContext): IBlock {
  return findBlockWith(uuid, getActiveFlowFrom(ctx))
}

export function findNestedFlowIdFor(interaction: IBlockInteraction, ctx: IContext): string {
  const flow = findFlowWith(interaction.flowId, ctx)
  const runFlowBlock = findBlockWith(interaction.blockId, flow)
  const flowId = (runFlowBlock.config as IRunFlowBlockConfig).flowId

  if (flowId == null) {
    throw new ValidationException('Unable to find nested flowId on Core\\RunFlow')
  }

  return flowId
}

export function getActiveFlowIdFrom(ctx: IContext): string {
  const {firstFlowId, nestedFlowBlockInteractionIdStack} = ctx

  if (nestedFlowBlockInteractionIdStack.length === 0) {
    return firstFlowId
  }

  const interaction = findInteractionWith(last(nestedFlowBlockInteractionIdStack) as string, ctx)
  return findNestedFlowIdFor(interaction, ctx)
}

export function getActiveFlowFrom(ctx: IContext): IFlow {
  return findFlowWith(getActiveFlowIdFrom(ctx), ctx)
}

export function isLastBlockOn(ctx: IContext, block: IBlock): boolean {
  return !isNested(ctx) && isLastBlock(block)
}

export function isNested({nestedFlowBlockInteractionIdStack}: IContext): boolean {
  return nestedFlowBlockInteractionIdStack.length > 0
}

export const contextService: IContextService = {
  findInteractionWith,
  findFlowWith,
  findBlockOnActiveFlowWith,
  findNestedFlowIdFor,
  getActiveFlowIdFrom,
  getActiveFlowFrom,
  isLastBlockOn,
  isNested,
}

export interface IContextService {
  findInteractionWith(uuid: string, {interactions}: IContext): IBlockInteraction

  findFlowWith(uuid: string, ctx: IContext): IFlow

  findBlockOnActiveFlowWith(uuid: string, ctx: IContext): IBlock

  findNestedFlowIdFor(interaction: IBlockInteraction, ctx: IContext): string

  getActiveFlowIdFrom(ctx: IContext): string

  getActiveFlowFrom(ctx: IContext): IFlow

  isLastBlockOn(ctx: IContext, block: IBlock): boolean

  isNested(ctx: IContext): boolean
}

export const ContextService: IContextService = {
  findInteractionWith,
  findFlowWith,
  findBlockOnActiveFlowWith,
  findNestedFlowIdFor,
  getActiveFlowIdFrom,
  getActiveFlowFrom,
  isLastBlockOn,
  isNested,
}
