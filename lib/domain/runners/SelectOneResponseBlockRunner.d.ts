import IBlockRunner from "./IBlockRunner";
import IBlock from "../../flow-spec/IBlock";
import { ISelectOnePromptConfig } from "../prompt/ISelectOnePromptConfig";
import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import IBlockExit from "../../flow-spec/IBlockExit";
import { RichCursorInputRequiredType } from "../../flow-spec/IContext";
import ISelectOneResponseBlockConfig from "../../model/block/ISelectOneResponseBlockConfig";
export default class SelectOneResponseBlockRunner implements IBlockRunner {
    block: IBlock & {
        config: ISelectOneResponseBlockConfig;
    };
    constructor(block: IBlock & {
        config: ISelectOneResponseBlockConfig;
    });
    initialize(interaction: IBlockInteraction): ISelectOnePromptConfig;
    run(cursor: RichCursorInputRequiredType): IBlockExit;
}
//# sourceMappingURL=SelectOneResponseBlockRunner.d.ts.map