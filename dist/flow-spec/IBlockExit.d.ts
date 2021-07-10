export interface IBlockExit {
    uuid: string;
    name: string;
    destination_block?: string;
    semantic_label?: string;
    test?: string;
    config: object;
    default?: boolean;
}
export interface IBlockExitTestRequired extends IBlockExit {
    test: string;
}
//# sourceMappingURL=IBlockExit.d.ts.map