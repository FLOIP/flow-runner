import { IPromptConfig, KnownPrompts } from './IPrompt';
export interface ISelectOnePromptConfig extends IPromptConfig<IChoice['key'] | null> {
    kind: KnownPrompts.SelectOne;
    choices: IChoice[];
}
export interface IChoice {
    key: string;
    value: string;
}
//# sourceMappingURL=ISelectOnePromptConfig.d.ts.map