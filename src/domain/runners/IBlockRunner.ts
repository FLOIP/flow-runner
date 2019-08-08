import IBlock from "../../flow-spec/IBlock";
import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import IPrompt from "../../flow-spec/IPrompt";
import {PromptExpectationsType} from "../prompt/BasePrompt";
import IBlockExit from "../../flow-spec/IBlockExit";
import {RichCursorType} from "../../flow-spec/IContext";

export default interface IBlockRunner {
  block: IBlock

  initialize(interaction: IBlockInteraction): IPrompt<PromptExpectationsType> | null
  run(cursor: RichCursorType): IBlockExit
}
