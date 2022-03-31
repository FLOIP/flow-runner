import { IBlockConfig } from '../..';
export interface INumericBlockConfig extends IBlockConfig {
    prompt: string;
    validation_minimum?: number;
    validation_maximum?: number;
    ivr?: {
        max_digits?: number;
    };
}
//# sourceMappingURL=INumericBlockConfig.d.ts.map