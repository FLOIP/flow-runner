import { ISetContactPropertyBlockConfig } from '../../../index';
export interface ISelectOneResponseBlockConfig extends ISetContactPropertyBlockConfig {
    prompt: string;
    promptAudio: string;
    questionPrompt?: string;
    choicesPrompt?: string;
    choices: StringMapType;
}
declare type StringMapType = {
    [k: string]: string;
};
export {};
//# sourceMappingURL=ISelectOneResponseBlockConfig.d.ts.map