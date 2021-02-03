import { IResource } from '../..';
export interface IAdvancedSelectOneBlockConfig {
    prompt: string;
    prompt_audio?: string;
    primary_field: string;
    secondary_fields: string[];
    choice_row_fields: string[];
    choice_rows: IResource['uuid'];
    response_fields?: string[];
}
//# sourceMappingURL=IAdvancedSelectOneBlockConfig.d.ts.map