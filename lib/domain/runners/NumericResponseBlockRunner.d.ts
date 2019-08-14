import IBlockRunner from "./IBlockRunner";
import { RichCursorInputRequiredType } from "../../flow-spec/IContext";
import IBlockExit from "../../flow-spec/IBlockExit";
import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import { INumericPromptConfig } from "../prompt/INumericPromptConfig";
import IBlock from "../../flow-spec/IBlock";
import INumericBlockConfig from "../../model/block/INumericBlockConfig";
export default class NumericResponseBlockRunner implements IBlockRunner {
    block: IBlock & {
        config: INumericBlockConfig;
    };
    constructor(block: IBlock & {
        config: INumericBlockConfig;
    });
    initialize(interaction: IBlockInteraction): INumericPromptConfig;
    run(cursor: RichCursorInputRequiredType): IBlockExit;
}
//# sourceMappingURL=NumericResponseBlockRunner.d.ts.map