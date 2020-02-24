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

import {NonBreakingUpdateOperation} from 'sp2'

import IContact from './IContact'
import IFlow, {findBlockWith} from './IFlow'
import IBlockInteraction from './IBlockInteraction'
import IPrompt, {IBasePromptConfig, IPromptConfig} from '../domain/prompt/IPrompt'
import IBlock, {isLastBlock} from './IBlock'
import IRunFlowBlockConfig from '../model/block/IRunFlowBlockConfig'
import {find, findLast, last} from 'lodash'
import ValidationException from '../domain/exceptions/ValidationException'
import DeliveryStatus from './DeliveryStatus'
import SupportedMode from './SupportedMode'
import {IResourceDefinition, IResources} from '..'
import IIdGenerator from '../domain/IIdGenerator'
import IdGeneratorUuidV4 from '../domain/IdGeneratorUuidV4'
import createFormattedDate from '../domain/DateFormat'


export interface ICursor {
  /**
   * UUID of the current interaction with a block.
   */
  interactionId: string,
  /**
   * A prompt configuration data object; optional, because not every block requests input from the Contact.
   * If it does, we call it an `ICursorInputRequired`.
   * If not, `ICursorNoInputRequired` will have a `null-ish` `promptConfig`.
   */
  promptConfig?: (IPromptConfig<any> & IBasePromptConfig),
}

export interface ICursorInputRequired {
  interactionId: string,
  promptConfig: IPromptConfig<any> & IBasePromptConfig,
}

export interface ICursorNoInputRequired {
  interactionId: string,
  promptConfig: undefined,
}

export interface IRichCursor {
  /**
   * An object representation of the current interaction with a block.
   */
  interaction: IBlockInteraction,
  /**
   * In IPrompt instance.
   * When present, we call it a TRichCursorInputRequired.
   * In absence, the TRichCursorNoInputRequired will maintain `prompt` with a null-ish value.
   */
  prompt?: IPrompt<IPromptConfig<any> & IBasePromptConfig>,
}

export interface IRichCursorInputRequired {
  interaction: IBlockInteraction,
  prompt: IPrompt<IPromptConfig<any> & IBasePromptConfig>,
}

export interface IRichCursorNoInputRequired {
  interaction: IBlockInteraction,
  prompt: undefined,
}

export interface IReversibleUpdateOperation {
  interactionId?: string,
  forward: NonBreakingUpdateOperation,
  reverse: NonBreakingUpdateOperation,
}

export interface IContext {
  id: string,
  createdAt: string,
  entryAt?: string,
  exitAt?: string,
  deliveryStatus: DeliveryStatus,

  userId?: string,
  orgId?: string,
  mode: SupportedMode,
  languageId: string,

  contact: IContact,
  sessionVars: any, // todo: what is an object type with any properties?
  interactions: IBlockInteraction[],
  nestedFlowBlockInteractionIdStack: string[],
  reversibleOperations: IReversibleUpdateOperation[],
  cursor?: ICursor,

  flows: IFlow[],
  firstFlowId: string,
  resources: IResources,
  platformMetadata: object,

  logs: {[k: string]: string},
}

export default IContext

export interface IContextWithCursor extends IContext {
  cursor: ICursor,
}

export interface IContextInputRequired extends IContext {
  cursor: ICursorInputRequired,
}

export function createContextDataObjectFor(
  contact: IContact,
  userId: string,
  orgId: string,
  flows: IFlow[],
  languageId: string,
  mode: SupportedMode = SupportedMode.OFFLINE,
  resources: IResourceDefinition[] = [],
  idGenerator: IIdGenerator = new IdGeneratorUuidV4(),
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
    throw new ValidationException(`Unable to find interaction on context: ${uuid} in ${interactions.map(i => i.uuid)}`)
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

export function isLastBlockOn({nestedFlowBlockInteractionIdStack}: IContext, block: IBlock): boolean {
  return nestedFlowBlockInteractionIdStack.length === 0 && isLastBlock(block)
}

export const contextService: IContextService = {
  findInteractionWith,
  findFlowWith,
  findBlockOnActiveFlowWith,
  findNestedFlowIdFor,
  getActiveFlowIdFrom,
  getActiveFlowFrom,
  isLastBlockOn,
}

export interface IContextService {
  findInteractionWith(uuid: string, {interactions}: IContext): IBlockInteraction,
  findFlowWith(uuid: string, ctx: IContext): IFlow,
  findBlockOnActiveFlowWith(uuid: string, ctx: IContext): IBlock,
  findNestedFlowIdFor(interaction: IBlockInteraction, ctx: IContext): string,
  getActiveFlowIdFrom(ctx: IContext): string,
  getActiveFlowFrom(ctx: IContext): IFlow,
  isLastBlockOn(ctx: IContext, block: IBlock): boolean,
}
