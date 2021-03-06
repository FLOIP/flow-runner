import { BasePrompt, IChoice, ISelectManyPromptConfig } from '../..';
export declare const INVALID_AT_LEAST_ONE_SELECTION_REQUIRED = "At least one selection is required, but none provided";
export declare const INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK = "All selections must be valid choices on block";
export declare const SELECT_MANY_PROMPT_KEY = "SelectMany";
export declare class SelectManyPrompt extends BasePrompt<ISelectManyPromptConfig> {
    validate(selections: IChoice['key'][]): boolean;
}
//# sourceMappingURL=SelectManyPrompt.d.ts.map