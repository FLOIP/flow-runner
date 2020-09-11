import { IPromptConfig } from '../../../index';
export interface ISelectOnePromptConfig extends IPromptConfig<string | null> {
    kind: string;
    choices: IChoice[];
    emptyChoicesMessage?: string;
}
export interface IChoice {
    key: string;
    value: string;
}
//# sourceMappingURL=ISelectOnePromptConfig.d.ts.map