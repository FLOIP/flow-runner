import { IPromptConfig } from '../..';
export interface IAdvancedSelectOnePromptConfig extends IPromptConfig<IAdvancedSelectOne[]> {
    promptAudio: string;
    primaryField: string;
    secondaryFields: string[];
    choiceRowFields: string[];
    choiceRows: string[][];
    responseFields: string[];
}
export interface IAdvancedSelectOne {
    name: string;
    value: string;
}
//# sourceMappingURL=IAdvancedSelectOnePromptConfig.d.ts.map