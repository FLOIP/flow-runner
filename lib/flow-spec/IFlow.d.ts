import IBlock from './IBlock';
import { Mode } from './Mode';
export default interface IFlow {
    uuid: string;
    name: string;
    label?: string;
    lastModified: Date;
    interactionTimeout: number;
    platformMetadata: object;
    supportedModes: Mode[];
    languages: string[];
    blocks: IBlock[];
    firstBlockId: string;
    exitBlockId?: string;
}
export declare function findBlockWith(uuid: string, { blocks }: IFlow): IBlock;
//# sourceMappingURL=IFlow.d.ts.map