import { IBlock, IBlockExit, IBlockInteraction, IContext, IFlow, IPromptConfig } from '../..';
export interface IDataset {
    _prompts: IPromptConfig<any>[];
    contexts: IContext[];
    _defaults: object;
    _flows: IFlow[];
    _blocks: IBlock[];
    _block_exits: IBlockExit[];
    _block_interactions: IBlockInteraction[];
    _cursors: [];
}
export declare const DATA_SOURCE: any;
export declare function createDefaultDataset(): IDataset;
//# sourceMappingURL=IDataset.d.ts.map