import IBlockInteraction from "../../flow-spec/IBlockInteraction";
import { RichCursorType } from "../../flow-spec/IContext";
import IBlockRunner from "./IBlockRunner";
import IBlock from "../../flow-spec/IBlock";
import IBlockExit from "../../flow-spec/IBlockExit";
import IRunFlowBlockConfig from "../../model/block/IRunFlowBlockConfig";
export default class RunFlowBlockRunner implements IBlockRunner {
    block: IBlock & {
        config: IRunFlowBlockConfig;
    };
    constructor(block: IBlock & {
        config: IRunFlowBlockConfig;
    });
    initialize(interaction: IBlockInteraction): null;
    run(cursor: RichCursorType): IBlockExit;
}
//# sourceMappingURL=RunFlowBlockRunner.d.ts.map