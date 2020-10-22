import { BasePrompt, IAdvancedSelectOne, IAdvancedSelectOnePromptConfig } from '../..';
export declare const ADVANCED_SELECT_ONE_PROMPT_KEY = "AdvancedSelectOne";
export declare class AdvancedSelectOnePrompt extends BasePrompt<IAdvancedSelectOnePromptConfig> {
    validate(selectedRow?: IAdvancedSelectOne[], choiceRows?: string[][]): boolean;
}
//# sourceMappingURL=AdvancedSelectOnePrompt.d.ts.map