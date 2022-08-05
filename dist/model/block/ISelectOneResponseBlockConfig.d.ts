import { IBlockConfig } from '../..';
declare type Uuid = string;
export interface ISelectOneResponseBlockConfig extends IBlockConfig {
    prompt?: Uuid;
    question_prompt?: Uuid;
    choices: IChoice[];
    ivr?: IvrConfig;
}
export interface IChoice {
    name: string;
    ivr_test?: IvrTest;
    text_tests?: TextTest[];
    prompt: Uuid;
}
export interface IvrTest {
    test_expression: string;
}
export interface TextTest {
    language?: string;
    test_expression: string;
}
export interface IvrConfig {
    digit_prompts?: Uuid[];
    randomize_choice_order?: boolean;
}
export {};
//# sourceMappingURL=ISelectOneResponseBlockConfig.d.ts.map