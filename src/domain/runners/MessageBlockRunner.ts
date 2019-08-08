import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import {RichCursorType} from "../../flow-spec/IContext";
import IBlockRunner from "./IBlockRunner";
import IBlock from "../../flow-spec/IBlock";
import IBlockExit from "../../flow-spec/IBlockExit";
import IPrompt from "../../flow-spec/IPrompt";
import {PromptExpectationsType} from "../prompt/BasePrompt";


export default class MessageBlockRunner implements IBlockRunner {
  constructor(
      public block: IBlock) {}

  initialize(interaction: IBlockInteraction): IPrompt<PromptExpectationsType> | null {
    return null
  }

  run(cursor: RichCursorType): IBlockExit {
    return this.block.exits[0]
  }
}
