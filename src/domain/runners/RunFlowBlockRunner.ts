import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import {RichCursorType} from "../../flow-spec/IContext";
import IBlockRunner from "./IBlockRunner";
import IBlock from "../../flow-spec/IBlock";
import IBlockExit from "../../flow-spec/IBlockExit";
import RunFlowBlockConfig from "../../model/block/RunFlowBlockConfig";

export default class implements IBlockRunner {
  constructor(
      public block: IBlock & {config: RunFlowBlockConfig}) {}

  initialize(interaction: IBlockInteraction): null {
    return null
  }

  run(cursor: RichCursorType): IBlockExit {
    return this.block.exits[0]
  }
}
