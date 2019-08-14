import { IPromptConfig } from "./IPrompt";
import { KnownPrompts } from "./IPrompt";
export interface IOpenPromptConfig extends IPromptConfig<string | null> {
    kind: KnownPrompts.Open;
}
//# sourceMappingURL=IOpenPromptConfig.d.ts.map