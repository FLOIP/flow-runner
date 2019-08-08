import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import {RichCursorType} from "../../flow-spec/IContext";
import IBlockRunner from "./IBlockRunner";
import IBlock from "../../flow-spec/IBlock";
import IBlockExit from "../../flow-spec/IBlockExit";

export default class implements IBlockRunner {
  constructor(
      public block: IBlock) {}

  initialize(interaction: IBlockInteraction): null {
    return null
  }

  run(cursor: RichCursorType): IBlockExit {
    return {} as IBlockExit
  }
}
