import { IResource } from '../..';
export interface IAdvancedSelectOneBlockConfig {
    prompt: string;
    promptAudio?: string;
    primaryField: string;
    secondaryFields?: string[];
    choiceRowFields: string[];
    choiceRows: IResource['uuid'];
    responseFields?: string[];
}
//# sourceMappingURL=IAdvancedSelectOneBlockConfig.d.ts.map