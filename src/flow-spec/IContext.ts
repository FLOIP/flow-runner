import {NonBreakingUpdateOperation} from 'sp2'

import IContact from './IContact'
import IFlow, {findBlockWith} from './IFlow'
import IBlockInteraction from './IBlockInteraction'
import IPrompt, {IBasePromptConfig, IPromptConfig} from '../domain/prompt/IPrompt'
import IBlock from './IBlock'
import IRunFlowBlockConfig from '../model/block/IRunFlowBlockConfig'
import {find, findLast, last} from 'lodash'
import ValidationException from '../domain/exceptions/ValidationException'
import DeliveryStatus from './DeliveryStatus'
import SupportedMode from './SupportedMode'
import {IResourceDefinition, IResources} from '..'
import IIdGenerator from '../domain/IIdGenerator'
import IdGeneratorUuidV4 from '../domain/IdGeneratorUuidV4'
import createFormattedDate from '../domain/DateFormat'


export type TCursor = [string, (IPromptConfig<any> & IBasePromptConfig) | undefined]
export type TCursorInputRequired = [string /* UUID64*/, IPromptConfig<any> & IBasePromptConfig]
export type TCursorNoInputRequired = [string, undefined]

export type TRichCursor = [IBlockInteraction, IPrompt<IPromptConfig<any> & IBasePromptConfig> | undefined]
export type TRichCursorInputRequired = [IBlockInteraction, IPrompt<IPromptConfig<any> & IBasePromptConfig>]
export type TRichCursorNoInputRequired = [IBlockInteraction, undefined]

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
  sessionVars: any // todo: what is an object type with any properties?
  interactions: IBlockInteraction[]
  nestedFlowBlockInteractionIdStack: string[]
  reversibleOperations: IReversibleUpdateOperation[]
  cursor?: TCursor

  flows: IFlow[]
  firstFlowId: string
  resources: IResources
  platformMetadata: object

  logs: {[k: string]: string}
}

export default IContext

export interface IContextWithCursor extends IContext {
  cursor: TCursor
}

export interface IContextInputRequired extends IContext {
  cursor: TCursorInputRequired
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

export function isLastBlockOn({nestedFlowBlockInteractionIdStack}: IContext, {exits}: IBlock): boolean {
  return nestedFlowBlockInteractionIdStack.length === 0
    && exits.every(e => e.destinationBlock == null)
}
