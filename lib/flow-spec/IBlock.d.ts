import IBlockExit from "./IBlockExit";
export default interface IBlock {
    uuid: string;
    name: string;
    label?: string;
    semantic_label?: string;
    type: string;
    config: object;
    exits: IBlockExit[];
}
export declare function findBlockExitWith(uuid: string, block: IBlock): IBlockExit;
//# sourceMappingURL=IBlock.d.ts.map