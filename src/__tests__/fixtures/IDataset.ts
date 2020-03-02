import IFlow from "../../flow-spec/IFlow";
import IBlock from "../../flow-spec/IBlock";
import IBlockExit from "../../flow-spec/IBlockExit";
import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import IContext from "../../flow-spec/IContext";
import {read} from 'yaml-import'
import {cloneDeep} from 'lodash'
import {IBasePromptConfig, IPromptConfig} from '../../index'

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

export const DATA_SOURCE = read('src/__tests__/fixtures/dataset.yml')

export function createDefaultDataset(): IDataset {
  return cloneDeep(DATA_SOURCE)
}