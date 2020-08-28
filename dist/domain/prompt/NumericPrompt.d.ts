import { BasePrompt, INumericPromptConfig } from '../..';
export declare const NUMERIC_PROMPT_KEY = "Numeric";
export declare class NumericPrompt extends BasePrompt<INumericPromptConfig> {
    static readonly promptKey = "Numeric";
    validate(val: number): boolean;
}
//# sourceMappingURL=NumericPrompt.d.ts.map