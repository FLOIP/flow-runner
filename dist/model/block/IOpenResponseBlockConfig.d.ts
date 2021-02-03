import { ISetContactPropertyBlockConfig } from '../..';
export interface IOpenResponseBlockConfig extends ISetContactPropertyBlockConfig {
    prompt: string;
    prompt_audio: string;
    ivr?: {
        max_duration_seconds: number;
    };
    text?: {
        max_response_characters?: number;
    };
}
//# sourceMappingURL=IOpenResponseBlockConfig.d.ts.map