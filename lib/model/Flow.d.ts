import IFlow from "../flow-spec/IFlow";
import Mode from "../flow-spec/Mode";
import IBlock from "../flow-spec/IBlock";
export declare class Flow implements IFlow {
    blocks: IBlock[];
    interaction_timeout: number;
    label: string;
    languages: string[];
    last_modified: Date;
    name: string;
    platform_metadata: object;
    supported_modes: Mode[];
    uuid: string;
    constructor(blocks: IBlock[], interaction_timeout: number, label: string, languages: string[], last_modified: Date, name: string, platform_metadata: object, supported_modes: Mode[], uuid: string);
}
//# sourceMappingURL=Flow.d.ts.map