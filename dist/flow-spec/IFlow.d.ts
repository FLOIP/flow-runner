import { IBlock, ILanguage, SupportedMode } from '..';
export interface IFlow {
    uuid: string;
    name: string;
    label?: string;
    last_modified: string;
    interaction_timeout: number;
    platform_metadata: object;
    supported_modes: SupportedMode[];
    languages: ILanguage[];
    blocks: IBlock[];
    first_block_id: string;
    exit_block_id?: string;
}
export declare function findBlockWith(uuid: string, { blocks }: IFlow): IBlock;
export interface IFlowService {
    findBlockWith(uuid: string, flow: IFlow): IBlock;
}
//# sourceMappingURL=IFlow.d.ts.map