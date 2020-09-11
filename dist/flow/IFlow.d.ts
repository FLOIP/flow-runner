import { IBlock, ILanguage, SupportedMode } from '../index';
export interface IFlow {
    uuid: string;
    orgId: string;
    name: string;
    label?: string;
    lastModified: string;
    interactionTimeout: number;
    platformMetadata: object;
    supportedModes: SupportedMode[];
    languages: ILanguage[];
    blocks: IBlock[];
    firstBlockId: string;
    exitBlockId?: string;
}
export declare function findBlockWith(uuid: string, { blocks }: IFlow): IBlock;
export interface IFlowService {
    findBlockWith(uuid: string, flow: IFlow): IBlock;
}
//# sourceMappingURL=IFlow.d.ts.map