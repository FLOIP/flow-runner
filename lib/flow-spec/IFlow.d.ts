import IBlock from "./IBlock";
import { Mode } from "./Mode";
export default interface IFlow {
    uuid: string;
    name: string;
    label?: string;
    last_modified: Date;
    interaction_timeout: number;
    platform_metadata: object;
    supported_modes: Mode[];
    languages: string[];
    blocks: IBlock[];
    firstBlockId: string;
    exitBlockId: string | null;
}
export declare function findBlockWith(uuid: string, { blocks }: IFlow): IBlock;
//# sourceMappingURL=IFlow.d.ts.map