import { IBlockConfig, IBlockExit, IContact, IContext } from '..';
export interface IBlockUIMetadataCanvasCoordinates {
    x: number;
    y: number;
}
export interface IBlockUIMetadata extends Record<string, any> {
    canvas_coordinates?: IBlockUIMetadataCanvasCoordinates;
}
export interface IBlockVendorMetadata extends Record<string, any> {
    floip: IBlockVendorMetadataFloip;
}
export interface IBlockVendorMetadataFloip extends Record<string, any> {
    ui_metadata: IFloipUIMetadata;
}
export interface IFloipUIMetadata extends Record<string, any> {
    branching_type: string;
    should_auto_update_name?: boolean;
}
export interface IBlock<BLOCK_CONFIG = IBlockConfig, BLOCK_VENDOR_METADATA = IBlockVendorMetadata> {
    uuid: string;
    name: string;
    label?: string;
    semantic_label?: string;
    tags?: Array<string>;
    vendor_metadata?: BLOCK_VENDOR_METADATA;
    ui_metadata?: IBlockUIMetadata;
    type: string;
    config: BLOCK_CONFIG;
    exits: IBlockExit[];
}
export declare function findBlockExitWith(uuid: string, block: IBlock): IBlockExit;
export declare function findFirstTruthyEvaluatingBlockExitOn(block: IBlock, context: IContext): IBlockExit | undefined;
export declare function firstTrueBlockExitOrNull(block: IBlock, context: IContext): IBlockExit | undefined;
export declare function firstTrueOrNullBlockExitOrThrow(block: IBlock, context: IContext): IBlockExit;
export declare function findDefaultBlockExitOnOrNull(block: IBlock): IBlockExit | undefined;
export declare function findDefaultBlockExitOrThrow(block: IBlock): IBlockExit;
export declare function isLastBlock({ exits }: IBlock): boolean;
export interface IEvalContextBlock {
    __value__: unknown;
    time: string;
    __interactionId: string;
    value: unknown;
    text: string;
}
export declare type TEvalContextBlockMap = {
    [k: string]: IEvalContextBlock;
};
export declare function generateCachedProxyForBlockName(target: object, ctx: IContext): TEvalContextBlockMap;
export declare function createEvalContextFrom(context: IContext): object;
export declare function createEvalContactFrom(contact: IContact): IContact;
export declare function evaluateToBool(expr: string, ctx: object): boolean;
export declare function evaluateToString(expr: string, ctx: object): string;
export declare function wrapInExprSyntaxWhenAbsent(expr: string): string;
export declare function setContactProperty(block: IBlock, context: IContext): void;
export interface IBlockService {
    findBlockExitWith(uuid: string, block: IBlock): IBlockExit;
    findFirstTruthyEvaluatingBlockExitOn(block: IBlock, context: IContext): IBlockExit | undefined;
    firstTrueBlockExitOrNull(block: IBlock, context: IContext): IBlockExit | undefined;
    firstTrueBlockExitOrThrow(block: IBlock, context: IContext): IBlockExit;
    findDefaultBlockExitOrNull(block: IBlock): IBlockExit | undefined;
    findDefaultBlockExitOrThrow(block: IBlock): IBlockExit;
    findDefaultBlockExitOn(block: IBlock): IBlockExit;
    isLastBlock(block: IBlock): boolean;
    generateCachedProxyForBlockName(target: object, ctx: IContext): object;
    createEvalContextFrom(context: IContext): object;
    evaluateToBool(expr: string, ctx: object): boolean;
    setContactProperty<BLOCK_CONFIG extends IBlockConfig>(block: IBlock<BLOCK_CONFIG>, context: IContext): void;
}
//# sourceMappingURL=IBlock.d.ts.map