import { IPromptConfig, KnownPrompts } from './IPrompt';
import IReadBlockConfig from '../../model/block/IReadBlockConfig';
export declare type TReadableType = string | number | null;
export interface IReadPromptConfig extends IPromptConfig<TReadableType[]>, IReadBlockConfig {
    kind: KnownPrompts.Read;
}
//# sourceMappingURL=IReadPromptConfig.d.ts.map