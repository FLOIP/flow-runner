import { ISetContactPropertyBlockConfig } from '../..';
export interface INumericBlockConfig extends ISetContactPropertyBlockConfig {
    prompt: string;
    promptAudio: string;
    validationMinimum: number;
    validationMaximum: number;
    ivr: {
        maxDigits: number;
    };
}
//# sourceMappingURL=INumericBlockConfig.d.ts.map