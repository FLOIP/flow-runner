import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import { RichCursorType } from "../../flow-spec/IContext";
import IBlockRunner from "./IBlockRunner";
import IBlock from "../../flow-spec/IBlock";
import IBlockExit from "../../flow-spec/IBlockExit";
import { IMessagePromptConfig } from "../prompt/IMessagePromptConfig";
import IMessageBlockConfig from "../../model/block/IMessageBlockConfig";
export default class MessageBlockRunner implements IBlockRunner {
    block: IBlock & {
        config: IMessageBlockConfig;
    };
    constructor(block: IBlock & {
        config: IMessageBlockConfig;
    });
    initialize(interaction: IBlockInteraction): IMessagePromptConfig;
    run(cursor: RichCursorType): IBlockExit;
}
//# sourceMappingURL=MessageBlockRunner.d.ts.map