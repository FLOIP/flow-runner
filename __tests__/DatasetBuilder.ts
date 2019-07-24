import {cloneDeep, keyBy} from 'lodash'
import {read} from 'yaml-import'
import IBlockExit from "../src/flow-spec/IBlockExit";
import IBlockInteraction from "../src/flow-spec/IBlockInteraction";
import IFlow from "../src/flow-spec/IFlow";
import IBlock from "../src/flow-spec/IBlock";
import IContext from "../src/flow-spec/IContext";

export type RunnerDatasetType = {
  exits: Partial<IBlockExit>[],
  blocks: Partial<IBlock>[],
  flows: Partial<IFlow>[],
  contexts: Partial<IContext>[],
  interactions: Partial<IBlockInteraction>[]
}

export type RunnerDatasetIndexesType = {
  exitsByUuid: any,
  blocksByUuid: any,
  flowsByUuid: any,
  interactionsByUuid: any
}

export default class {
  public data: RunnerDatasetType
  public indexedData: RunnerDatasetIndexesType


  fetch() {
    this.data = {
      exits: read('__tests__/datasets/block_exits.yml'), // no mappings
      blocks: read('__tests__/datasets/blocks.yml'), // map (exits)
      flows: read('__tests__/datasets/flows.yml'), // map (blocks)
      contexts: read('__tests__/datasets/contexts.yml'), // map (flows)
      interactions: read('__tests__/datasets/block_interactions.yml'), // no mappings
    }
  }

  generateIndexes() {
    this.indexedData = {
      exitsByUuid: keyBy(this.data.exits, 'uuid'),
      blocksByUuid: keyBy(this.data.blocks, 'uuid'),
      flowsByUuid: keyBy(this.data.flows, 'uuid'),
      interactionsByUuid: keyBy(this.data.interactions, 'uuid'),
    }
  }

  assemble(): RunnerDatasetType & RunnerDatasetIndexesType {
    this.data.blocks.forEach((b: any) =>
        b.exits = b.exits.map((e: any) =>
            this.indexedData.exitsByUuid[e]))

    this.data.flows.forEach((f: any) =>
        f.blocks = f.blocks.map((b: any) =>
            this.indexedData.blocksByUuid[b]))

    this.data.contexts.forEach((c: any) => {
      c.flows = c.flows.map((f: any) =>
          this.indexedData.flowsByUuid[f])

      c.interactions = c.interactions.map((i: any) =>
          this.indexedData.interactionsByUuid[i])
    })

    // console.log(JSON.stringify(contexts, null, 2))

    return {
      ...cloneDeep(this.data),
      ...cloneDeep(this.indexedData)
    }
  }
}
