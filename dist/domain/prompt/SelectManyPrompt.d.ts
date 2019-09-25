import BasePrompt from './BasePrompt';
import { IBasePromptConfig } from './IPrompt';
import { ISelectManyPromptConfig } from './ISelectManyPromptConfig';
import { IChoice } from './ISelectOnePromptConfig';
export declare const INVALID_AT_LEAST_ONE_SELECTION_REQUIRED = "At least one selection is required, but none provided";
export declare const INVALID_ALL_SELECTIONS_MUST_EXIST_ON_BLOCK = "All selections must be valid choices on block";
export default class SelectManyPrompt extends BasePrompt<ISelectManyPromptConfig & IBasePromptConfig> {
    validate(selections: IChoice['key'][]): boolean;
}
//# sourceMappingURL=SelectManyPrompt.d.ts.map