import { IPromptConfig } from '../..';
import { Choice } from '../../model/block/ISelectOneResponseBlockConfig';
export interface ISelectOnePromptConfig extends IPromptConfig<string | null> {
    kind: string;
    choices: Choice[];
    emptyChoicesMessage?: string;
}
//# sourceMappingURL=ISelectOnePromptConfig.d.ts.map