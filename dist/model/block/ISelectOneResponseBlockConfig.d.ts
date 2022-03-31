import { IBlockConfig } from '../..';
export interface ISelectOneResponseBlockConfig extends IBlockConfig {
    prompt: string;
    question_prompt?: string;
    choices: StringMapType;
}
declare type StringMapType = {
    [k: string]: string;
};
export {};
//# sourceMappingURL=ISelectOneResponseBlockConfig.d.ts.map