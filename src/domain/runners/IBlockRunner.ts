import IBlock from "../../flow-spec/IBlock";
import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import IPrompt from "../../flow-spec/IPrompt";
import {PromptExpectationsType} from "../prompt/BasePrompt";
import IBlockExit from "../../flow-spec/IBlockExit";
import {RichCursorType} from "../../flow-spec/IContext";

export default interface IBlockRunner {
  block: IBlock

  start(interaction: IBlockInteraction): IPrompt<PromptExpectationsType> | null
  resume(cursor: RichCursorType): IBlockExit
}
