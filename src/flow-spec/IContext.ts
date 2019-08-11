import {IPromptExpectationTypes} from "../domain/prompt/BasePrompt"
import IContact from "./IContact";
import IFlow, {findBlockWith} from "./IFlow";
import ISession from "./ISession";
import IBlockInteraction from "./IBlockInteraction";
import IPrompt from "../domain/prompt/IPrompt";
import IBlock from "./IBlock";
import RunFlowBlockConfig from "../model/block/RunFlowBlockConfig";
import {find, last} from 'lodash'
import ValidationException from "../domain/exceptions/ValidationException";


export type CursorType = [string, IPrompt<IPromptExpectationTypes> | null]
export type CursorInputRequiredType = [string /*UUID64*/, IPrompt<IPromptExpectationTypes>]
export type CursorNoInputRequiredType = [string, null]

export type RichCursorType = [IBlockInteraction, IPrompt<IPromptExpectationTypes> | null]
export type RichCursorInputRequiredType = [IBlockInteraction, IPrompt<IPromptExpectationTypes>]
export type RichCursorNoInputRequiredType = [IBlockInteraction, null]

export default interface IContext {
  flows: IFlow[]
  firstFlowId: string
  interactions: IBlockInteraction[]
  contact: IContact
  session: ISession
  sessionVars: object
  nestedFlowBlockInteractionIdStack: string[]
  cursor: CursorType | null
}

export interface IContextWithCursor extends IContext {
  cursor: CursorType
}

export interface IContextInputRequired extends IContext {
  cursor: CursorInputRequiredType
}

export function findInteractionWith(uuid: string, {interactions}: IContext): IBlockInteraction {
  const interaction = find(interactions, {uuid})
  if (!interaction) {
    throw new ValidationException(`Unable to find interaction on context: ${uuid} in ${interactions.map(i => i.uuid)}`)
  }

  return interaction
}

export function findFlowWith(uuid: string, {flows}: IContext): IFlow {
  const flow = find(flows, {uuid})
  if (!flow) {
    throw new ValidationException(`Unable to find flow on context: ${uuid} in ${flows.map(f => f.uuid)}`)
  }

  return flow
}

export function findBlockOnActiveFlowWith(uuid: string, ctx: IContext): IBlock {
  return findBlockWith(uuid, getActiveFlowFrom(ctx))
}

export function findNestedFlowIdFor(interaction: IBlockInteraction, ctx: IContext) {
  const
      flow = findFlowWith(interaction.flowId, ctx),
      runFlowBlock = findBlockWith(interaction.blockId, flow)

  const flowId = (runFlowBlock.config as RunFlowBlockConfig).flow_id
  if (!flowId) {
    throw new ValidationException('Unable to find nested flowId on Core\\RunFlowBlock')
  }

  return flowId
}

export function getActiveFlowIdFrom(ctx: IContext): string {
  const {firstFlowId, nestedFlowBlockInteractionIdStack} = ctx

  if (!nestedFlowBlockInteractionIdStack.length) {
    return firstFlowId
  }

  const interaction = findInteractionWith(last(nestedFlowBlockInteractionIdStack) as string, ctx)
  return findNestedFlowIdFor(interaction, ctx)
}

export function getActiveFlowFrom(ctx: IContext): IFlow {
  return findFlowWith(getActiveFlowIdFrom(ctx), ctx)
}
