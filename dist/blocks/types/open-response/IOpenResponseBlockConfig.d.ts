import { ISetContactPropertyBlockConfig } from '../../../index';
export interface IOpenResponseBlockConfig extends ISetContactPropertyBlockConfig {
    prompt: string;
    promptAudio: string;
    ivr?: {
        maxDurationSeconds: number;
    };
    text?: {
        maxResponseCharacters?: number;
    };
}
//# sourceMappingURL=IOpenResponseBlockConfig.d.ts.map