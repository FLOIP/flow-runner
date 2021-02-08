import { ISetContactPropertyBlockConfig } from '../..';
export interface INumericBlockConfig extends ISetContactPropertyBlockConfig {
    prompt: string;
    prompt_audio: string;
    validation_minimum: number;
    validation_maximum: number;
    ivr: {
        max_digits: number;
    };
}
//# sourceMappingURL=INumericBlockConfig.d.ts.map