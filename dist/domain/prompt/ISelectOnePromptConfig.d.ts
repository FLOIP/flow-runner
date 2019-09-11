import { IPromptConfig, KnownPrompts } from './IPrompt';
import { IResource } from '../IResourceResolver';
export interface ISelectOnePromptConfig extends IPromptConfig<string | null> {
    kind: KnownPrompts.SelectOne;
    choices: IChoice[];
}
export interface IChoice {
    key: string;
    value: IResource;
}
//# sourceMappingURL=ISelectOnePromptConfig.d.ts.map