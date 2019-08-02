import IFlow from "../src/flow-spec/IFlow";
import IBlock from "../src/flow-spec/IBlock";
import IBlockExit from "../src/flow-spec/IBlockExit";
import IBlockInteraction from "../src/flow-spec/IBlockInteraction";
import IContext from "../src/flow-spec/IContext";

export default interface IDataset {
  defaults: object
  flows: IFlow[]
  blocks: IBlock[]
  block_exits: IBlockExit[]
  block_interactions: IBlockInteraction[]
  contexts: IContext[]
  cursors: []
}
