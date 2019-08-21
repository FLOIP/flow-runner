import IFlow from "../../src/flow-spec/IFlow";
import IBlock from "../../src/flow-spec/IBlock";
import IBlockExit from "../../src/flow-spec/IBlockExit";
import IBlockInteraction from "../../src/flow-spec/IBlockInteraction";
import IContext from "../../src/flow-spec/IContext";
import {read} from 'yaml-import'
import {cloneDeep} from 'lodash'
import {IBasePromptConfig, IPromptConfig} from '../../src'

export default interface IDataset {
  _prompts: (IPromptConfig<any> & IBasePromptConfig)[]
  contexts: IContext[]
  _defaults: object
  _flows: IFlow[]
  _blocks: IBlock[]
  _block_exits: IBlockExit[]
  _block_interactions: IBlockInteraction[]
  _cursors: []
}

export const DATA_SOURCE = read('__tests__/fixtures/dataset.yml')

export function createDefaultDataset(): IDataset {
  return cloneDeep(DATA_SOURCE)
}