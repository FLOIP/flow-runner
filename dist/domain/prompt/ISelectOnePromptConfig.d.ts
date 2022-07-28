import { IPromptConfig } from '../..';
import { IChoice } from '../../model/block/ISelectOneResponseBlockConfig';
export interface ISelectOnePromptConfig extends IPromptConfig<string | null> {
    kind: string;
    choices: IChoice[];
    emptyChoicesMessage?: string;
}
//# sourceMappingURL=ISelectOnePromptConfig.d.ts.map