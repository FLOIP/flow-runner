import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import {RichCursorType} from "../../flow-spec/IContext";
import IBlockRunner from "./IBlockRunner";
import IBlock from "../../flow-spec/IBlock";
import IBlockExit from "../../flow-spec/IBlockExit";
import {IMessagePromptConfig} from "../prompt/IMessagePromptConfig";
import IMessageBlockConfig from "../../model/block/IMessageBlockConfig";
import {KnownPrompts} from "../prompt/IPrompt";


export default class MessageBlockRunner implements IBlockRunner {
  constructor(
      public block: IBlock & {config: IMessageBlockConfig}) {}

  initialize(interaction: IBlockInteraction): IMessagePromptConfig {
    return {
      kind: KnownPrompts.Message,
      isResponseRequired: false,
      value: null,
    }
  }

  run(cursor: RichCursorType): IBlockExit {
    return this.block.exits[0]
  }
}
