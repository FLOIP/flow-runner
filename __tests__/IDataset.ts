import IFlow from "../src/flow-spec/IFlow";
import IBlock from "../src/flow-spec/IBlock";
import IBlockExit from "../src/flow-spec/IBlockExit";
import IBlockInteraction from "../src/flow-spec/IBlockInteraction";
import IContext from "../src/flow-spec/IContext";

export default interface IDataset {
  contexts: IContext[]
  _defaults: object
  _flows: IFlow[]
  _blocks: IBlock[]
  _block_exits: IBlockExit[]
  _block_interactions: IBlockInteraction[]
  _cursors: []
}
