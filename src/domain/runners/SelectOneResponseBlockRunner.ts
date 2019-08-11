import IBlockRunner from "./IBlockRunner";
import IBlock from "../../flow-spec/IBlock";
import {ISelectOnePromptConfig} from "../prompt/ISelectOnePromptConfig";
import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import IBlockExit from "../../flow-spec/IBlockExit";
import {RichCursorInputRequiredType} from "../../flow-spec/IContext";
import ISelectOneResponseBlockConfig from "../../model/block/ISelectOneResponseBlockConfig";

export default class SelectOneResponseBlockRunner implements IBlockRunner {
  constructor(
      public block: IBlock & {config: ISelectOneResponseBlockConfig}) {}

  initialize(interaction: IBlockInteraction): ISelectOnePromptConfig {
    return {
      kind: "SelectOne",
      choices: Array.from(this.block.config.choices.keys()),
      isResponseRequired: true,
    }
  }

  run(cursor: RichCursorInputRequiredType): IBlockExit {
    // todo: need to know how we provide selected value on a context to an expression evaluator here
    return this.block.exits[0]
  }
}
