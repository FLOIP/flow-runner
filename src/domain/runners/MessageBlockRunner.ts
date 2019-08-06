import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import {RichCursorType} from "../../flow-spec/IContext";
import IBlockRunner from "./IBlockRunner";
import IBlock from "../../flow-spec/IBlock";
import IBlockExit from "../../flow-spec/IBlockExit";


export default class implements IBlockRunner {
  constructor(
      public block: IBlock) {}

  start(interaction: IBlockInteraction): null {
    return null
  }

  resume(cursor: RichCursorType): IBlockExit {
    const selectedExit = this.block.exits[0]
    cursor[0].details.selectedExitId = selectedExit.uuid

    return selectedExit
  }
}
