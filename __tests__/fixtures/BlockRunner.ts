import IBlock from "../../src/flow-spec/IBlock";
import IBlockInteraction from "../../src/flow-spec/IBlockInteraction";
import {RichCursorInputRequiredType} from "../../src/flow-spec/IContext";
import IBlockRunner from "../../src/domain/runners/IBlockRunner";

export const createStaticMessageBlockRunnerFor = (block: IBlock) => ({
  block,
  initialize: (interaction: IBlockInteraction) => null,
  run: (cursor: RichCursorInputRequiredType) => block.exits[0]
} as IBlockRunner)
