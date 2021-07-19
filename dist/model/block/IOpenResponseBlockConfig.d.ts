import { IBlockConfig } from './IBlockConfig';
export interface IOpenResponseBlockConfig extends IBlockConfig {
    prompt: string;
    ivr?: {
        max_duration_seconds?: number;
    };
    text?: {
        max_response_characters?: number;
    };
}
//# sourceMappingURL=IOpenResponseBlockConfig.d.ts.map