import IBlock from "../../flow-spec/IBlock";
import IBlockExit from "../../flow-spec/IBlockExit";
export default class Block implements IBlock {
    uuid: string;
    config: object;
    exits: IBlockExit[];
    label: string;
    name: string;
    semantic_label: string;
    type: string;
    constructor(uuid: string, config: object, exits: IBlockExit[], label: string, name: string, semantic_label: string, type: string);
}
//# sourceMappingURL=Block.d.ts.map