import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import {RichCursorType} from "../../flow-spec/IContext";
import IBlockRunner from "./IBlockRunner";
import IBlock from "../../flow-spec/IBlock";
import IBlockExit from "../../flow-spec/IBlockExit";
// import BlockExit from "../../model/BlockExit";

export default class implements IBlockRunner {
  constructor(
      public block: IBlock) {}

  start(interaction: IBlockInteraction): null {
    return null
  }

  resume(cursor: RichCursorType): IBlockExit {
    return {} as IBlockExit
  }
}
