import IBlockExit, { IBlockExitTestRequired } from './IBlockExit';
import IContext from './IContext';
export default interface IBlock {
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
export interface IEvalContextBlock {
    __value__: any;
    time: string;
    __interactionId: string;
}
export declare function findAndGenerateExpressionBlockFor(blockName: IBlock['name'], ctx: IContext): IEvalContextBlock | undefined;
export declare function generateCachedProxyForBlockName(target: object, ctx: IContext): object;
export declare function createEvalContextFrom(context: IContext): {
    contact: import("./IContact").default;
    channel: {
        mode: import("./SupportedMode").SupportedMode;
    };
    flow: object;
    block: {
        value: any;
    } | {
        value: any;
        uuid: string;
        name: string;
        label?: string | undefined;
        semanticLabel?: string | undefined;
        type: string;
        config: object;
        exits: IBlockExit[];
    };
};
//# sourceMappingURL=IBlock.d.ts.map