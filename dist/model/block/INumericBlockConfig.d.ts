import { IBlockConfig } from './IBlockConfig';
export interface INumericBlockConfig extends IBlockConfig {
    prompt: string;
    validation_minimum?: number | null;
    validation_maximum?: number | null;
    ivr?: {
        max_digits?: number | null;
    };
}
//# sourceMappingURL=INumericBlockConfig.d.ts.map