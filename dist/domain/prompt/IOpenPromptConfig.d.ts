import { IPromptConfig, KnownPrompts } from './IPrompt';
export interface IOpenPromptConfig extends IPromptConfig<string | null> {
    kind: KnownPrompts.Open;
    maxResponseCharacters?: number;
}
//# sourceMappingURL=IOpenPromptConfig.d.ts.map