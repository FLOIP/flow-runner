import { Context, IPromptConfig } from '../..';
export interface IAdvancedSelectOnePromptConfig extends IPromptConfig<IAdvancedSelectOne[]> {
    promptAudio?: string;
    primaryField: string;
    secondaryFields: string[];
    choiceRowFields: string[];
    choiceRows: string[][];
    responseFields?: string[];
}
export interface IAdvancedSelectOne {
    name: string;
    value: string;
}
export declare function getConfigWithResourcesForAdvancedSelectOne(context: Context, config: IAdvancedSelectOnePromptConfig): IAdvancedSelectOnePromptConfig;
//# sourceMappingURL=IAdvancedSelectOnePromptConfig.d.ts.map