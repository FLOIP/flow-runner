export interface IBlockExit<BLOCK_EXIT_CONFIG = {}> {
    uuid: string;
    label: string;
    tag: string;
    destination_block?: string;
    semantic_label?: string;
    test?: string;
    config: BLOCK_EXIT_CONFIG;
    default?: boolean;
}
//# sourceMappingURL=IBlockExit.d.ts.map