import IBlock from './IBlock';
import SupportedMode from './SupportedMode';
import ILanguage from './ILanguage';
export default interface IFlow {
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
//# sourceMappingURL=IFlow.d.ts.map