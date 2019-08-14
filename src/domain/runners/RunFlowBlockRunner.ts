import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import {RichCursorType} from "../../flow-spec/IContext";
import IBlockRunner from "./IBlockRunner";
import IBlock from "../../flow-spec/IBlock";
import IBlockExit from "../../flow-spec/IBlockExit";
import IRunFlowBlockConfig from "../../model/block/IRunFlowBlockConfig";

export default class RunFlowBlockRunner implements IBlockRunner {
  constructor(
      public block: IBlock & {config: IRunFlowBlockConfig}) {}

  initialize(interaction: IBlockInteraction): null {
    return null
  }

  run(cursor: RichCursorType): IBlockExit {
    return this.block.exits[0]
  }
}
