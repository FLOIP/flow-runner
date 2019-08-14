import IBlockRunner from "./IBlockRunner";
import IBlock from "../../flow-spec/IBlock";
import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import IBlockExit from "../../flow-spec/IBlockExit";
import {RichCursorInputRequiredType} from "../../flow-spec/IContext";
import {IOpenPromptConfig} from "../prompt/IOpenPromptConfig";
import IOpenResponseBlockConfig from "../../model/block/IOpenResponseBlockConfig";
import {KnownPrompts} from "../prompt/IPrompt";

export default class OpenResponseBlockRunner implements IBlockRunner {
  constructor(
      public block: IBlock & {config: IOpenResponseBlockConfig}) {}

  initialize(interaction: IBlockInteraction): IOpenPromptConfig {
    return {
      kind: KnownPrompts.Open,
      isResponseRequired: true,
      value: null,
    }
  }

  run(cursor: RichCursorInputRequiredType): IBlockExit {
    // todo: should there be a BaseBlockRunner that defaults to returning first exit?
    return this.block.exits[0]
  }
}
