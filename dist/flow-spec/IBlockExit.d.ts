export interface IBlockExit {
    uuid: string;
    label: string;
    tag: string;
    destinationBlock?: string;
    semanticLabel?: string;
    test?: string;
    config: object;
    default?: boolean;
}
export default IBlockExit;
export interface IBlockExitTestRequired extends IBlockExit {
    test: string;
}
//# sourceMappingURL=IBlockExit.d.ts.map