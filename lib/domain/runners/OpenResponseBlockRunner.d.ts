import IBlockRunner from "./IBlockRunner";
import IBlock from "../../flow-spec/IBlock";
import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import IBlockExit from "../../flow-spec/IBlockExit";
import { RichCursorInputRequiredType } from "../../flow-spec/IContext";
import { IOpenPromptConfig } from "../prompt/IOpenPromptConfig";
import IOpenResponseBlockConfig from "../../model/block/IOpenResponseBlockConfig";
export default class OpenResponseBlockRunner implements IBlockRunner {
    block: IBlock & {
        config: IOpenResponseBlockConfig;
    };
    constructor(block: IBlock & {
        config: IOpenResponseBlockConfig;
    });
    initialize(interaction: IBlockInteraction): IOpenPromptConfig;
    run(cursor: RichCursorInputRequiredType): IBlockExit;
}
//# sourceMappingURL=OpenResponseBlockRunner.d.ts.map