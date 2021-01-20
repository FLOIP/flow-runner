import { BasePrompt, ISelectOnePromptConfig } from '../..';
export declare const SELECT_ONE_PROMPT_KEY = "SelectOne";
export declare class SelectOnePrompt extends BasePrompt<ISelectOnePromptConfig> {
    validateOrThrow(choiceKey: ISelectOnePromptConfig['value']): void;
}
//# sourceMappingURL=SelectOnePrompt.d.ts.map