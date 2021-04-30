import { ISelectOneResponseBlock } from '../..';
export interface ISelectManyResponseBlock extends ISelectOneResponseBlock {
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
//# sourceMappingURL=ISelectManyResponseBlock.d.ts.map