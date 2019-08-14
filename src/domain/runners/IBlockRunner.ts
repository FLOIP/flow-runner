import IBlock from "../../flow-spec/IBlock";
import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import IBlockExit from "../../flow-spec/IBlockExit";
import {RichCursorType} from "../../flow-spec/IContext";
import {IPromptConfig} from "../prompt/IPrompt";

export default interface IBlockRunner {
  block: IBlock

  initialize(interaction: IBlockInteraction): IPromptConfig<any> | null
  run(cursor: RichCursorType): IBlockExit
}
