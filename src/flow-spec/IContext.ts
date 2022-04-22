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
import {
  createFormattedDate,
  DeliveryStatus,
  findBlockWith,
  IBlock,
  IBlockInteraction,
  IContact,
  IdGeneratorUuidV4,
  IFlow,
  IGroup,
  IIdGenerator,
  IPrompt,
  IPromptConfig,
  IRunFlowBlockConfig,
  isLastBlock,
  SupportedMode,
  ValidationException,
} from '..'
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
  promptConfig?: IPromptConfig
}

export interface ICursorInputRequired {
  interactionId: string
  promptConfig: IPromptConfig
}

export interface ICursorNoInputRequired {
  interactionId: string
  promptConfig: undefined
}

export interface IRichCursor<PROMPT_CONFIG extends IPromptConfig = IPromptConfig> {
  /**
   * An object representation of the current interaction with a block.
   */
  interaction: IBlockInteraction
  /**
   * In IPrompt instance.
   * When present, we call it a TRichCursorInputRequired.
   * In absence, the TRichCursorNoInputRequired will maintain `prompt` with a null-ish value.
   */
  prompt?: IPrompt<PROMPT_CONFIG>
}

export interface IRichCursorInputRequired<PROMPT_CONFIG extends IPromptConfig = IPromptConfig> {
  interaction: IBlockInteraction
  prompt: IPrompt<PROMPT_CONFIG>
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
  created_at: string
  entry_at?: string
  exit_at?: string
  delivery_status: DeliveryStatus

  user_id?: string
  org_id?: string
  mode: SupportedMode
  language_id: string

  contact: IContact
  groups: IGroup[]

  session_vars: {[k: string]: unknown}
  interactions: IBlockInteraction[]
  nested_flow_block_interaction_id_stack: string[]
  reversible_operations: IReversibleUpdateOperation[]
  cursor?: ICursor

  flows: IFlow[]
  first_flow_id: string
  vendor_metadata: {[k: string]: unknown}

  logs: {[k: string]: string}
}

export interface IContextWithCursor extends IContext {
  cursor: ICursor
}

export interface IContextInputRequired extends IContext {
  cursor: ICursorInputRequired
}

export async function createContextDataObjectFor(
  contact: IContact,
  groups: IGroup[],
  userId: string,
  orgId: string,
  flows: IFlow[],
  languageId: string,
  mode: SupportedMode = SupportedMode.OFFLINE,
  idGenerator: IIdGenerator = new IdGeneratorUuidV4()
): Promise<IContext> {
  return {
    id: await idGenerator.generate(),
    created_at: createFormattedDate(),
    delivery_status: DeliveryStatus.QUEUED,

    user_id: userId,
    org_id: orgId,
    mode,
    language_id: languageId,

    contact,
    groups,
    session_vars: {},
    interactions: [],
    nested_flow_block_interaction_id_stack: [],
    reversible_operations: [],

    flows,
    first_flow_id: flows[0].uuid,

    vendor_metadata: {},

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
  const flow = findFlowWith(interaction.flow_id, ctx)
  const runFlowBlock = findBlockWith(interaction.block_id, flow)
  const flowId = (runFlowBlock.config as IRunFlowBlockConfig).flow_id

  if (flowId == null) {
    throw new ValidationException('Unable to find nested flowId on Core.RunFlow')
  }

  return flowId
}

export function getActiveFlowIdFrom(ctx: IContext): string {
  const {first_flow_id, nested_flow_block_interaction_id_stack} = ctx

  if (nested_flow_block_interaction_id_stack.length === 0) {
    return first_flow_id
  }

  const interaction = findInteractionWith(last(nested_flow_block_interaction_id_stack) as string, ctx)
  return findNestedFlowIdFor(interaction, ctx)
}

export function getActiveFlowFrom(ctx: IContext): IFlow {
  return findFlowWith(getActiveFlowIdFrom(ctx), ctx)
}

export function isLastBlockOn(ctx: IContext, block: IBlock): boolean {
  return !isNested(ctx) && isLastBlock(block)
}

export function isNested({nested_flow_block_interaction_id_stack}: IContext): boolean {
  return nested_flow_block_interaction_id_stack.length > 0
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
