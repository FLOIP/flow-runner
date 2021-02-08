import { ISetContactPropertyBlockConfig } from '../..';
export interface ISelectOneResponseBlockConfig extends ISetContactPropertyBlockConfig {
    prompt: string;
    prompt_audio: string;
    question_prompt?: string;
    choices_prompt?: string;
    choices: StringMapType;
}
declare type StringMapType = {
    [k: string]: string;
};
export {};
//# sourceMappingURL=ISelectOneResponseBlockConfig.d.ts.map