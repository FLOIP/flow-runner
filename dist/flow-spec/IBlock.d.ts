import { IBlockExit, IBlockExitTestRequired, IContext } from '..';
export interface IBlock {
    uuid: string;
    name: string;
    label?: string;
    semanticLabel?: string;
    type: string;
    config: object;
    exits: IBlockExit[];
}
export interface IBlockWithTestExits extends IBlock {
    exits: IBlockExitTestRequired[];
}
export declare function findBlockExitWith(uuid: string, block: IBlock): IBlockExit;
export declare function findFirstTruthyEvaluatingBlockExitOn(block: IBlockWithTestExits, context: IContext): IBlockExitTestRequired | undefined;
export declare function findDefaultBlockExitOn(block: IBlock): IBlockExit;
export declare function isLastBlock({ exits }: IBlock): boolean;
export interface IEvalContextBlock {
    __value__: any;
    time: string;
    __interactionId: string;
    value: any;
    text: string;
}
export declare type TEvalContextBlockMap = {
    [k: string]: IEvalContextBlock;
};
export declare function generateCachedProxyForBlockName(target: object, ctx: IContext): TEvalContextBlockMap;
export declare function createEvalContextFrom(context: IContext): object;
export declare function evaluateToBool(expr: string, ctx: object): boolean;
export declare function evaluateToString(expr: string, ctx: object): string;
export declare function wrapInExprSyntaxWhenAbsent(expr: string): string;
export declare function setContactProperty(block: IBlock, context: IContext): void;
export interface IBlockService {
    findBlockExitWith(uuid: string, block: IBlock): IBlockExit;
    findFirstTruthyEvaluatingBlockExitOn(block: IBlockWithTestExits, context: IContext): IBlockExitTestRequired | undefined;
    findDefaultBlockExitOn(block: IBlock): IBlockExit;
    isLastBlock(block: IBlock): boolean;
    findAndGenerateExpressionBlockFor(blockName: IBlock['name'], ctx: IContext): IEvalContextBlock | undefined;
    generateCachedProxyForBlockName(target: object, ctx: IContext): object;
    createEvalContextFrom(context: IContext): object;
    evaluateToBool(expr: string, ctx: object): boolean;
}
//# sourceMappingURL=IBlock.d.ts.map