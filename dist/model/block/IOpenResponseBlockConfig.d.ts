import { IBlockConfig } from '../..';
export interface IOpenResponseBlockConfig extends IBlockConfig {
    prompt: string;
    ivr?: {
        max_duration_seconds?: number;
        end_recording_digits?: string;
    };
}
//# sourceMappingURL=IOpenResponseBlockConfig.d.ts.map