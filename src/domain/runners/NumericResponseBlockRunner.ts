import IBlockRunner from "./IBlockRunner";
import {RichCursorInputRequiredType} from "../../flow-spec/IContext";
import IBlockExit from "../../flow-spec/IBlockExit";
import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import {INumericPromptConfig} from "../prompt/INumericPromptConfig";
import IBlock from "../../flow-spec/IBlock";
import INumericBlockConfig from "../../model/block/INumericBlockConfig";

export default class implements IBlockRunner {
  constructor(
      public block: IBlock & {config: INumericBlockConfig}) {}


  initialize(interaction: IBlockInteraction): INumericPromptConfig {
    return {
      kind: "Numeric",
      maxLength: 0, // todo: is this viamo-specific and no longer necessary?
      min: this.block.config["validation-minimum"],
      max: this.block.config['validation-maximum'],
      isResponseRequired: false,
    }
  }

  run(cursor: RichCursorInputRequiredType): IBlockExit {
    // todo: what constitutes an error exit on web/android chanels?

    return this.block.exits[0]
  }
}
