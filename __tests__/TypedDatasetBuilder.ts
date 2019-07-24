import IContext from "../src/flow-spec/IContext";
import NumericPrompt from "../src/domain/prompt/NumericPrompt";
import IBlockExit from "../src/flow-spec/IBlockExit";
import BlockExit from "../src/model/BlockExit";
import IFlow from "../src/flow-spec/IFlow";
import Mode from "../src/flow-spec/Mode";
import {Flow} from "../src/model/Flow";
import IBlock from "../src/flow-spec/IBlock";
import Block from "../src/model/block/Block";
import DatasetBuilder from './DatasetBuilder'
import IBlockInteraction from "../src/flow-spec/IBlockInteraction";

/**
 * flow       1e0
 * block      1e1
 * block exit 1e2
 * block intx 1e3
 */

export default () => {
  const builder = new DatasetBuilder
  builder.fetch()

  const d = builder.data
  d.exits = d.exits.map(e => createBlockExitWith(e))
  d.blocks = d.blocks.map(b => createBlockWith(b))
  d.flows = d.flows.map(f => createFlowWith(f))
  d.interactions = d.interactions.map(i => createBlockInteractionWith(i))
  d.contexts = d.contexts.map(c => createContextWith(c))

  // todo: why does this work right now? This scenario is funky:
  // - load block as {exits: ["xxx-xxx-xxx"]}
  // - map block as {... exits: ["xxx-xxx-xxx"]}
  // -

  builder.generateIndexes()
  return builder.assemble()
}

// todo: refactor { [P in keyof T]?: T[P] } into Partial<Type>
// todo: how do we get _actual_ generic nullable types?
export const createContextWith = <T extends IContext>({
  flows = [],
  firstFlowId,
  interactions = [],
  cursor = ['1', new NumericPrompt('10', '1', null)],
}: { [P in keyof T]?: T[P] }): IContext => ({

  // external
  flows,
  firstFlowId: firstFlowId || flows[0].uuid,
  interactions,
  cursor,

  // internal
  contact: {id: '1'},
  session: {id: '1', deliveryStatus: 'IN_PROGRESS'},
  sessionVars: {},
  nestedFlowBlockInteractionStack: [],
})

export const createFlowWith = <T extends IFlow>({
  blocks = [],
  interaction_timeout = 5,
  label = 'My first label',
  languages = ['en'],
  last_modified = new Date('2020-10-10'),
  name = 'My first flow',
  platform_metadata = {},
  supported_modes = [Mode.text],
  uuid = `${1e0}`
}: { [P in keyof T]?: T[P] }): IFlow =>
    new Flow(blocks, interaction_timeout, label, languages, last_modified, name, platform_metadata, supported_modes, uuid)

export const createBlockWith = <T extends IBlock>({
  name = 'My first block',
  label = '',
  config = {},
  exits = [],
  semantic_label = '',
  type = 'MobilePrimitives\\Message',
  uuid = `${1e1}`
}: { [P in keyof T]?: T[P] }): Block =>
    new Block(uuid, config, exits, label, name, semantic_label, type)

export const createBlockExitWith = <T extends IBlockExit>({ // todo: verify defaults from floip spec on these models
  uuid = `${1e2}`,
  semantic_label = '',
  label = '',
  config = {},
  destination_block = `${1e1}`,
  tag = '',
  test = ''
}: { [P in keyof T]?: T[P] }): IBlockExit =>
    new BlockExit(config, destination_block, label, semantic_label, tag, test, uuid)

export const createBlockInteractionWith = <T extends IBlockInteraction>({
  uuid = `${1e3}`,
  blockId = `${1e1}`,
  entryAt = new Date('2020-10-10'),
  exitAt = null,
  hasResponse = false,
  value = null,
  details = {selectedExitId: null},
  type = null,
  originBlockInteractionId = null,
  originFlowId = null,
}: Partial<IBlockInteraction>): IBlockInteraction => ({
  uuid,
  blockId,
  entryAt,
  exitAt,
  hasResponse,
  value,
  details,
  type,
  originBlockInteractionId,
  originFlowId,
})
