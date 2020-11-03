import { IContext, IPromptConfig, IResource } from '../..';
export interface IAdvancedSelectOnePromptConfig extends IPromptConfig<IAdvancedSelectOne[]> {
    promptAudio?: string;
    primaryField: string;
    secondaryFields?: string[];
    choiceRowFields: string[];
    choiceRows: IResource['uuid'];
    responseFields?: string[];
}
export interface IAdvancedSelectOne {
    name: string;
    value: string;
}
export declare function getConfigWithResourcesForAdvancedSelectOne(context: IContext, config: IAdvancedSelectOnePromptConfig): IAdvancedSelectOnePromptConfig;
//# sourceMappingURL=IAdvancedSelectOnePromptConfig.d.ts.map