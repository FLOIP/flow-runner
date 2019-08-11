import IBlock from "../../flow-spec/IBlock";
import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import {IPromptConfig} from "../prompt/BasePrompt";
import IBlockExit from "../../flow-spec/IBlockExit";
import {RichCursorType} from "../../flow-spec/IContext";

export default interface IBlockRunner {
  block: IBlock

  initialize(interaction: IBlockInteraction): IPromptConfig | null
  run(cursor: RichCursorType): IBlockExit
}
