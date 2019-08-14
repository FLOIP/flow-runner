import IBlockExit from "../flow-spec/IBlockExit";
export default class BlockExit implements IBlockExit {
    config: object;
    destination_block: string;
    label: string;
    semantic_label: string;
    tag: string;
    test: string;
    uuid: string;
    constructor(config: object, destination_block: string, label: string, semantic_label: string, tag: string, test: string, uuid: string);
}
//# sourceMappingURL=BlockExit.d.ts.map