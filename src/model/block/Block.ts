import IBlock from "../../flow-spec/IBlock";
import IBlockExit from "../../flow-spec/IBlockExit";

export default class Block implements IBlock {
  constructor(
      public uuid: string,
      public config: object,
      public exits: IBlockExit[],
      public label: string,
      public name: string,
      public semantic_label: string,
      public type: string) {}
}
