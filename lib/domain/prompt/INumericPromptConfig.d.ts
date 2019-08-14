import { KnownPrompts } from "./IPrompt";
import { IPromptConfig } from "./IPrompt";
export interface INumericPromptConfig extends IPromptConfig<number | null> {
    kind: KnownPrompts.Numeric;
    min: number;
    max: number;
    maxLength: number;
}
//# sourceMappingURL=INumericPromptConfig.d.ts.map