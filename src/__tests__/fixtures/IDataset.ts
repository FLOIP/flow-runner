import {IBlock, IBlockExit, IBlockInteraction, IContext, IFlow, IPromptConfig} from '../..'
import {read} from 'yaml-import'
import {cloneDeep} from 'lodash'

export interface IDataset {
  _prompts: IPromptConfig<any>[]
  contexts: IContext[]
  _defaults: object
  _flows: IFlow[]
  _blocks: IBlock[]
  _block_exits: IBlockExit[]
  _block_interactions: IBlockInteraction[]
  _cursors: []
}

export const DATA_SOURCE = read('src/__tests__/fixtures/dataset.yml')

export function createDefaultDataset(): IDataset {
  return cloneDeep(DATA_SOURCE)
}
