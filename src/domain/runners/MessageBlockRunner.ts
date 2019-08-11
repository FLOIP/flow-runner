import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import {RichCursorType} from "../../flow-spec/IContext";
import IBlockRunner from "./IBlockRunner";
import IBlock from "../../flow-spec/IBlock";
import IBlockExit from "../../flow-spec/IBlockExit";
import {IMessagePromptConfig} from "../prompt/IMessagePromptConfig";
import IMessageBlockConfig from "../../model/block/IMessageBlockConfig";


export default class implements IBlockRunner {
  constructor(
      public block: IBlock & {config: IMessageBlockConfig}) {}

  initialize(interaction: IBlockInteraction): IMessagePromptConfig {
    return {
      kind: "Message",
      isResponseRequired: false,
    }
  }

  run(cursor: RichCursorType): IBlockExit {
    return this.block.exits[0]
  }
}
