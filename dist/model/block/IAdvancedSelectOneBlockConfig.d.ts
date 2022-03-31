import { IBlockConfig } from '../..';
export interface IAdvancedSelectOneBlockConfig extends IBlockConfig {
    prompt: string;
    primary_field: string;
    secondary_fields: string[];
    choice_row_fields: string[];
    choice_rows: string;
    response_fields?: string[];
}
//# sourceMappingURL=IAdvancedSelectOneBlockConfig.d.ts.map