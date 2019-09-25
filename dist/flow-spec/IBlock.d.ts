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
//# sourceMappingURL=IBlock.d.ts.map